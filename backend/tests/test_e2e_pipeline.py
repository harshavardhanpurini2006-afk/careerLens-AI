import io
import sys
import os
import unittest
from starlette.testclient import TestClient

# Ensure backend is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

SAMPLE_RESUME_TEXT = """ALEX RIVERA
Email: alex.rivera@example.com | Phone: +1 (555) 349-2041 | Location: Austin, TX
LinkedIn: https://linkedin.com/in/alexrivera-demo | GitHub: https://github.com/alexrivera-ai

SUMMARY
Detail-oriented Artificial Intelligence graduate with practical experience in Python, SQL, and applied machine learning. Seeking an AI Engineer or ML role to contribute to production environments.

EDUCATION
B.Tech in Artificial Intelligence & Data Science
Apex Institute of Technology, Austin, TX | 2021 – 2025

TECHNICAL SKILLS
Languages: Python, SQL, Bash
Frameworks: NumPy, Pandas, Scikit-Learn, Matplotlib, Seaborn
Databases: PostgreSQL, SQLite
Tools: Git, GitHub, Jupyter, VS Code

PROJECTS
Student Performance Prediction System
- Preprocessed demographic and academic records across 1,000+ student profiles using Pandas.
- Implemented and tuned Decision Tree and Random Forest Regressors to forecast final exam grades.
- Generated feature importance plots highlighting study hours as the top predictor.

Customer Churn Classifier
- Trained a machine learning pipeline on telecom customer logs to identify churn risk indicators.
- Handled class imbalance using SMOTE and achieved an 83% validation ROC-AUC score.
- Developed an interactive Streamlit web dashboard for real-time customer parameter simulation.

EXPERIENCE
Machine Learning Intern | DataCore Solutions
- Assisted senior engineers in extracting and cleaning structured customer telemetry data using SQL.
- Built automated exploratory data analysis scripts in Python, reducing team reporting preparation time.
"""

class TestCareerLensE2EPipeline(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_full_user_journey(self):
        # 1. Health & Readiness
        res = self.client.get("/api/v1/health")
        self.assertEqual(res.status_code, 200)

        res = self.client.get("/api/v1/ready")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["database_connected"])

        # 2. Upload Resume
        file_bytes = io.BytesIO(SAMPLE_RESUME_TEXT.encode("utf-8"))
        upload_res = self.client.post(
            "/api/v1/resumes/upload",
            files={"file": ("alex_rivera_resume.txt", file_bytes, "text/plain")}
        )
        self.assertEqual(upload_res.status_code, 200)
        resume_data = upload_res.json()
        resume_id = resume_data["resumeId"]
        self.assertIsNotNone(resume_id)

        # 3. Status Check
        status_res = self.client.get(f"/api/v1/resumes/{resume_id}/status")
        self.assertEqual(status_res.status_code, 200)
        self.assertEqual(status_res.json()["status"], "completed")

        # 4. Candidate Profile
        profile_res = self.client.get(f"/api/v1/resumes/{resume_id}/profile")
        self.assertEqual(profile_res.status_code, 200)
        profile = profile_res.json()
        self.assertEqual(profile["name"], "ALEX RIVERA")
        self.assertEqual(profile["email"], "alex.rivera@example.com")
        self.assertGreaterEqual(len(profile["skills"]), 4)

        # 5. Recruiter Analysis
        analysis_res = self.client.get(f"/api/v1/resumes/{resume_id}/analysis")
        self.assertEqual(analysis_res.status_code, 200)
        analysis = analysis_res.json()
        self.assertIn("topRole", analysis)
        self.assertGreater(analysis["overallScore"], 0)

        # 6. ATS Readiness
        ats_res = self.client.get(f"/api/v1/resumes/{resume_id}/ats")
        self.assertEqual(ats_res.status_code, 200)
        ats = ats_res.json()
        self.assertGreater(ats["overallScore"], 50)
        self.assertEqual(len(ats["subScores"]), 5)

        # 7. Role Fits (5-factor score)
        roles_res = self.client.get(f"/api/v1/resumes/{resume_id}/roles")
        self.assertEqual(roles_res.status_code, 200)
        roles = roles_res.json()
        self.assertEqual(len(roles), 11)
        top_role = roles[0]
        self.assertGreater(top_role["deterministicScore"], 50)
        self.assertIn("radarMetrics", top_role)

        # 8. Skill Gaps
        skills_res = self.client.get(f"/api/v1/resumes/{resume_id}/skills?role_code={top_role['roleCode']}")
        self.assertEqual(skills_res.status_code, 200)
        gaps = skills_res.json()
        self.assertGreater(gaps["totalSkills"], 0)

        # 9. Projects
        proj_res = self.client.get(f"/api/v1/resumes/{resume_id}/projects")
        self.assertEqual(proj_res.status_code, 200)
        projects = proj_res.json()
        self.assertGreaterEqual(len(projects), 1)

        # 10. Roadmap
        road_res = self.client.get(f"/api/v1/resumes/{resume_id}/roadmap")
        self.assertEqual(road_res.status_code, 200)
        roadmap = road_res.json()
        self.assertGreater(len(roadmap["milestones"]), 0)

        # 11. Improvements
        imp_res = self.client.post(f"/api/v1/resumes/{resume_id}/improvements")
        self.assertEqual(imp_res.status_code, 200)
        improvements = imp_res.json()
        self.assertGreater(improvements["totalSuggestions"], 0)

        # 12. Job Description Analysis
        jd_payload = {
            "resumeId": resume_id,
            "jobDescriptionText": "Senior AI Engineer. Must have 3+ years experience with Python, PyTorch, Docker, and REST APIs. Preferred experience with AWS and LangChain."
        }
        jd_res = self.client.post("/api/v1/job-descriptions/analyze", json=jd_payload)
        self.assertEqual(jd_res.status_code, 200)
        jd_data = jd_res.json()
        self.assertIn("overallMatch", jd_data)

        # 13. Interview Session
        int_payload = {
            "resumeId": resume_id,
            "targetRole": "AI Engineer",
            "interviewType": "Technical",
            "difficulty": "Mid-Level"
        }
        int_res = self.client.post("/api/v1/interviews/start", json=int_payload)
        self.assertEqual(int_res.status_code, 200)
        session = int_res.json()
        self.assertEqual(len(session["questions"]), 3)

        # Answer first question
        q1 = session["questions"][0]
        ans_payload = {
            "questionId": q1["id"],
            "candidateAnswer": "In my project I used SMOTE which generates synthetic minority class samples along the line segments connecting k-nearest neighbors in feature space."
        }
        ans_res = self.client.post(f"/api/v1/interviews/{session['id']}/answer", json=ans_payload)
        self.assertEqual(ans_res.status_code, 200)
        eval_data = ans_res.json()
        self.assertGreater(eval_data["technicalAccuracyScore"], 60)

        # 14. Career Copilot Chat
        chat_payload = {
            "resumeId": resume_id,
            "message": "What are my biggest skill gaps for AI Engineer?"
        }
        chat_res = self.client.post("/api/v1/chat", json=chat_payload)
        self.assertEqual(chat_res.status_code, 200)
        chat_data = chat_res.json()
        self.assertIn("Verified Candidate Fact", chat_data["message"]["content"])

        # 15. Delete Resume Cascade Cleanup
        del_res = self.client.delete(f"/api/v1/resumes/{resume_id}")
        self.assertEqual(del_res.status_code, 200)

        # Verify 404 after deletion
        get_after = self.client.get(f"/api/v1/resumes/{resume_id}")
        self.assertEqual(get_after.status_code, 404)

if __name__ == "__main__":
    unittest.main()
