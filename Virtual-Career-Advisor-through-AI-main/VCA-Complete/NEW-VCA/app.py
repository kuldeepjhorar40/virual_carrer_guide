from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

app = Flask(__name__)

# Load the dataset
df = pd.read_csv('updated_merged_career_recommendation_dataset.csv')

# Preprocessing
label_encoders = {}
categorical_cols = ['Education Level', 'Skills', 'Interests', 'Personality Type', 'Preferred Work Style', 'Career Recommended']

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Features and target
X = df.drop(['ID', 'Career Recommended'], axis=1)
y = df['Career Recommended']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Check if model exists, otherwise train and save it
model_path = 'career_model.pkl'
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    joblib.dump(model, model_path)

@app.route('/')
def home():
    return render_template('recommend.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Get form data
        data = request.json
        
        # Prepare input data
        input_data = {
            'Age': int(data['age']),
            'Education Level': data['education'],
            'Skills': data['skills'],
            'Interests': data['interests'],
            'Personality Type': data['personality'],
            'Work Experience (Years)': int(data['experience']),
            'Preferred Work Style': data['workStyle']
        }
        
        # Convert to DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Encode categorical variables
        for col in categorical_cols:
            if col in input_df.columns:
                le = label_encoders[col]
                # Handle unseen labels by assigning a new value
                input_df[col] = input_df[col].apply(lambda x: x if x in le.classes_ else 'unknown')
                le_classes = le.classes_.tolist()
                if 'unknown' not in le_classes:
                    le_classes.append('unknown')
                    le.classes_ = le_classes
                input_df[col] = le.transform(input_df[col])
        
        # Make prediction
        prediction = model.predict(input_df.drop(['ID'], axis=1, errors='ignore'))
        predicted_career = label_encoders['Career Recommended'].inverse_transform(prediction)[0]
        
        # Get probabilities for all classes
        probabilities = model.predict_proba(input_df.drop(['ID'], axis=1, errors='ignore'))[0]
        
        # Get top 5 careers with their probabilities
        career_classes = label_encoders['Career Recommended'].classes_
        career_probs = list(zip(career_classes, probabilities))
        
        # Sort by probability (descending)
        career_probs.sort(key=lambda x: x[1], reverse=True)
        
        # Prepare response
        recommendations = []
        for i, (career, prob) in enumerate(career_probs[:6]):  # top 5 + primary
            match_percentage = round(prob * 100)
            if i == 0:
                recommendations.insert(0, {
                    'career': career,
                    'match': match_percentage,
                    'primary': True
                })
            else:
                recommendations.append({
                    'career': career,
                    'match': match_percentage,
                    'primary': False
                })
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)