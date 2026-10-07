"""
CareerLens AI - Database Seeder
Seeds 11 Core Job Roles, 300+ Canonical Technical Skills, Role-Skill Mappings,
RAG Knowledge Documents & Chunks, and initial Demo Data.
"""

import uuid
from app.db.session import SessionLocal, init_db
from app.models.job_role import JobRole, JobRoleSkill
from app.models.skill import Skill
from app.models.knowledge import KnowledgeDocument, DocumentChunk

JOB_ROLES_SEED = [
    {
        "role_code": "ai_engineer",
        "display_name": "AI Engineer",
        "category": "AI/ML",
        "description": "Designs, trains, and deploys intelligent models and AI systems into production software pipelines.",
        "experience_expectations": "0-2 years (Entry) with solid Python, ML algorithms, PyTorch/TensorFlow, and API deployment.",
        "common_tools": ["Python", "PyTorch", "FastAPI", "Docker", "Hugging Face", "PostgreSQL"],
        "project_expectations": ["End-to-end model training to API serving", "Evaluation metrics optimization", "Containerized deployment"],
        "interview_topics": ["Model architecture selection", "Overfitting & Regularization", "Inference optimization", "API integration"],
        "required_skills": ["Python", "Scikit-Learn", "PyTorch", "Docker", "SQL", "FastAPI"],
        "preferred_skills": ["Hugging Face", "MLflow", "AWS", "Git"]
    },
    {
        "role_code": "ml_engineer",
        "display_name": "Machine Learning Engineer",
        "category": "AI/ML",
        "description": "Bridges the gap between research data science and scalable production software architecture.",
        "experience_expectations": "0-2 years with strong algorithm foundations, feature stores, and CI/CD pipelines.",
        "common_tools": ["Python", "Scikit-Learn", "PyTorch", "Docker", "MLOps", "SQL"],
        "project_expectations": ["Scalable training pipeline", "Model tracking & registry", "Data drift monitoring"],
        "interview_topics": ["Feature engineering at scale", "Pipeline orchestration", "Latency tradeoffs"],
        "required_skills": ["Python", "Scikit-Learn", "SQL", "Docker", "Git"],
        "preferred_skills": ["PyTorch", "Kubernetes", "AWS", "MLflow"]
    },
    {
        "role_code": "genai_engineer",
        "display_name": "Generative AI Engineer",
        "category": "AI/ML",
        "description": "Builds applications leveraging LLMs, retrieval-augmented generation (RAG), and agentic workflows.",
        "experience_expectations": "Foundational ML with modern LLM prompt engineering, LangChain/LlamaIndex, and vector databases.",
        "common_tools": ["Python", "LangChain", "OpenAI API", "pgvector", "FastAPI"],
        "project_expectations": ["Production RAG pipeline", "Evaluation benchmark against hallucination", "Vector search"],
        "interview_topics": ["Chunking strategies", "Embeddings distance metrics", "Hallucination prevention"],
        "required_skills": ["Python", "SQL", "Vector Databases", "Prompt Engineering"],
        "preferred_skills": ["LangChain", "FastAPI", "Docker", "PyTorch"]
    },
    {
        "role_code": "data_analyst",
        "display_name": "Data Analyst",
        "category": "Data",
        "description": "Transforms structured business telemetry into actionable insights, dashboards, and KPI metrics.",
        "experience_expectations": "Proficient SQL, advanced Excel/Pandas, and dashboard visualization tools (Tableau, PowerBI).",
        "common_tools": ["SQL", "Python", "Pandas", "Tableau", "Power BI", "Excel"],
        "project_expectations": ["Exploratory Data Analysis report", "Interactive business KPI dashboard", "Cohort retention"],
        "interview_topics": ["Complex SQL joins & window functions", "A/B testing basics", "Storytelling with charts"],
        "required_skills": ["SQL", "Python", "Pandas", "Matplotlib"],
        "preferred_skills": ["Power BI", "Tableau", "Seaborn"]
    },
    {
        "role_code": "python_developer",
        "display_name": "Python Developer",
        "category": "Software",
        "description": "Develops robust backend services, automated scripts, and data ingestion services in Python.",
        "experience_expectations": "Deep Python syntax, object-oriented design, relational databases, and testing frameworks.",
        "common_tools": ["Python", "FastAPI", "Django", "PostgreSQL", "Git", "Docker"],
        "project_expectations": ["RESTful API backend", "Data ingestion pipeline", "PyTest coverage"],
        "interview_topics": ["Python concurrency", "Decorators & Generators", "Database transactions"],
        "required_skills": ["Python", "SQL", "Git"],
        "preferred_skills": ["FastAPI", "Docker", "PostgreSQL", "PyTest"]
    },
    {
        "role_code": "data_scientist",
        "display_name": "Data Scientist",
        "category": "Data",
        "description": "Extracts predictive insights from raw data using mathematical modeling, statistics, and machine learning.",
        "experience_expectations": "Solid statistical inference, hypothesis testing, feature engineering, and stakeholder communication.",
        "common_tools": ["Python", "Pandas", "Scikit-Learn", "SQL", "Statistics", "Jupyter"],
        "project_expectations": ["Hypothesis test report", "End-to-end predictive model with business impact"],
        "interview_topics": ["Statistical power", "Bias-Variance tradeoff", "Metric selection (AUC vs F1)"],
        "required_skills": ["Python", "Pandas", "SQL", "Scikit-Learn", "NumPy"],
        "preferred_skills": ["PyTorch", "A/B Testing", "Seaborn"]
    },
    {
        "role_code": "backend_developer",
        "display_name": "Backend Developer",
        "category": "Software",
        "description": "Architects scalable server-side systems, relational data structures, and secure client-facing APIs.",
        "experience_expectations": "Strong HTTP protocols, database indexing, caching strategies, and API security.",
        "common_tools": ["Python", "PostgreSQL", "FastAPI", "Docker", "Redis"],
        "project_expectations": ["Multi-endpoint CRUD API with authentication", "Database migration pipeline"],
        "interview_topics": ["Database normalization & index tuning", "REST vs GraphQL", "Authentication strategies"],
        "required_skills": ["Python", "SQL", "Git"],
        "preferred_skills": ["FastAPI", "Docker", "PostgreSQL", "Redis"]
    },
    {
        "role_code": "data_engineer",
        "display_name": "Data Engineer",
        "category": "Data",
        "description": "Builds high-throughput ETL pipelines, data warehouses, and batch/streaming data processing jobs.",
        "experience_expectations": "Distributed computing concepts, SQL optimization, data modeling, and orchestration.",
        "common_tools": ["Python", "SQL", "Apache Spark", "Airflow", "PostgreSQL", "Docker"],
        "project_expectations": ["Automated ETL ingestion pipeline", "Dimensional star-schema data warehouse"],
        "interview_topics": ["Partitioning & Sharding", "DAG orchestration", "Batch vs Streaming"],
        "required_skills": ["Python", "SQL", "Git"],
        "preferred_skills": ["Docker", "Airflow", "Apache Spark", "PostgreSQL"]
    },
    {
        "role_code": "nlp_engineer",
        "display_name": "NLP Engineer",
        "category": "AI/ML",
        "description": "Specializes in computational linguistics, text classification, transformers, and sequence modeling.",
        "experience_expectations": "Strong tokenization, embeddings, transformer architectures (BERT, RoBERTa), and PyTorch.",
        "common_tools": ["Python", "PyTorch", "Hugging Face", "NLTK", "Scikit-Learn"],
        "project_expectations": ["Custom text classifier or NER pipeline", "Semantic search implementation"],
        "interview_topics": ["Self-attention mechanisms", "Tokenization nuances", "Evaluation metrics (BLEU, ROUGE)"],
        "required_skills": ["Python", "Scikit-Learn", "SQL"],
        "preferred_skills": ["PyTorch", "Hugging Face", "Docker"]
    },
    {
        "role_code": "computer_vision_engineer",
        "display_name": "Computer Vision Engineer",
        "category": "AI/ML",
        "description": "Builds deep learning models for image classification, object detection, and visual perception.",
        "experience_expectations": "Convolutional neural networks, OpenCV, PyTorch/TensorFlow, and data augmentation.",
        "common_tools": ["Python", "OpenCV", "PyTorch", "YOLO", "Docker"],
        "project_expectations": ["Object detection or segmentation pipeline", "Image preprocessing pipeline"],
        "interview_topics": ["CNN architectures", "Data augmentation techniques", "Edge deployment tradeoffs"],
        "required_skills": ["Python", "NumPy", "Git"],
        "preferred_skills": ["OpenCV", "PyTorch", "Docker"]
    },
    {
        "role_code": "mlops_engineer",
        "display_name": "MLOps Engineer",
        "category": "AI/ML",
        "description": "Automates ML model deployment, monitoring, CI/CD, and pipeline reliability across cloud clusters.",
        "experience_expectations": "DevOps practices applied to machine learning: Docker, Kubernetes, CI/CD, and model tracking.",
        "common_tools": ["Docker", "Kubernetes", "MLflow", "GitHub Actions", "Python", "AWS"],
        "project_expectations": ["CI/CD automated retraining pipeline", "Monitoring stack with Prometheus/Grafana"],
        "interview_topics": ["Model drift detection", "Zero-downtime model deployments", "Container orchestration"],
        "required_skills": ["Python", "Git", "SQL"],
        "preferred_skills": ["Docker", "Kubernetes", "MLflow", "CI/CD"]
    }
]

# Taxonomy of 300+ Canonical Skills with categories and aliases
TAXONOMY_SKILLS = [
    # Programming
    ("Python", "Programming", ["python3", "python 3", "py"]),
    ("SQL", "Programming", ["structured query language", "ansi sql", "t-sql", "pl/sql"]),
    ("Bash", "Programming", ["shell", "sh", "zsh", "shell script", "bash scripting"]),
    ("JavaScript", "Programming", ["js", "es6", "vanilla js", "ecmascript"]),
    ("TypeScript", "Programming", ["ts"]),
    ("C++", "Programming", ["cpp", "c plus plus"]),
    ("Java", "Programming", ["core java", "j2se"]),
    ("Go", "Programming", ["golang"]),
    ("Rust", "Programming", ["rustlang"]),
    ("R", "Programming", ["r-lang", "r programming"]),
    ("Scala", "Programming", ["scala-lang"]),
    ("Julia", "Programming", ["julia-lang"]),
    ("HTML", "Programming", ["html5"]),
    ("CSS", "Programming", ["css3"]),

    # Machine Learning & Deep Learning
    ("Scikit-Learn", "Machine Learning", ["sklearn", "scikit learn"]),
    ("PyTorch", "Deep Learning", ["torch", "pytorch"]),
    ("TensorFlow", "Deep Learning", ["tf", "tensorflow"]),
    ("Keras", "Deep Learning", ["keras"]),
    ("NumPy", "Data", ["numpy"]),
    ("Pandas", "Data", ["pandas"]),
    ("SciPy", "Data", ["scipy"]),
    ("XGBoost", "Machine Learning", ["xgboost", "extreme gradient boosting"]),
    ("LightGBM", "Machine Learning", ["lgb", "lightgbm"]),
    ("CatBoost", "Machine Learning", ["catboost"]),
    ("Matplotlib", "Data", ["matplotlib", "plt"]),
    ("Seaborn", "Data", ["seaborn", "sns"]),
    ("Plotly", "Data", ["plotly"]),
    ("OpenCV", "Machine Learning", ["cv2", "opencv-python", "computer vision"]),
    ("YOLO", "Machine Learning", ["yolov8", "yolov5", "you only look once"]),
    ("Hugging Face", "Machine Learning", ["transformers", "huggingface", "hf"]),
    ("NLTK", "Machine Learning", ["natural language toolkit", "nltk"]),
    ("Spacy", "Machine Learning", ["spacy"]),
    ("Gensim", "Machine Learning", ["gensim", "word2vec"]),
    ("BERT", "Machine Learning", ["bert", "roberta", "distilbert"]),

    # Generative AI & LLMs
    ("LangChain", "Generative AI", ["langchain", "lang chain"]),
    ("LlamaIndex", "Generative AI", ["llamaindex", "gpt index"]),
    ("Prompt Engineering", "Generative AI", ["prompt design", "few-shot prompting"]),
    ("OpenAI API", "Generative AI", ["gpt-4", "chatgpt api", "openai"]),
    ("Anthropic Claude", "Generative AI", ["claude 3", "claude api"]),
    ("Ollama", "Generative AI", ["ollama"]),
    ("vLLM", "Generative AI", ["vllm"]),
    ("Fine-Tuning", "Generative AI", ["peft", "lora", "qlora"]),
    ("RAG", "Generative AI", ["retrieval augmented generation", "retrieval-augmented generation"]),
    ("Vector Databases", "Generative AI", ["vector db", "vector index", "embeddings database"]),
    ("Pinecone", "Generative AI", ["pinecone"]),
    ("Milvus", "Generative AI", ["milvus"]),
    ("ChromaDB", "Generative AI", ["chroma", "chromadb"]),
    ("Qdrant", "Generative AI", ["qdrant"]),
    ("FAISS", "Generative AI", ["faiss", "facebook ai similarity search"]),

    # Backend & Web Frameworks
    ("FastAPI", "Backend", ["fast api"]),
    ("Flask", "Backend", ["flask"]),
    ("Django", "Backend", ["django rest framework", "drf"]),
    ("Express.js", "Backend", ["express"]),
    ("NestJS", "Backend", ["nest.js"]),
    ("Spring Boot", "Backend", ["springboot", "spring"]),
    ("Node.js", "Backend", ["node", "nodejs"]),
    ("GraphQL", "Backend", ["apollo graphql", "graphql"]),
    ("REST API", "Backend", ["restful api", "rest", "http apis"]),
    ("gRPC", "Backend", ["grpc", "protobuf"]),
    ("Streamlit", "Framework", ["streamlit"]),
    ("Gradio", "Framework", ["gradio"]),

    # Databases
    ("PostgreSQL", "Databases", ["postgres", "psql", "pg"]),
    ("MySQL", "Databases", ["mysql", "mariadb"]),
    ("SQLite", "Databases", ["sqlite3"]),
    ("MongoDB", "Databases", ["mongo"]),
    ("Redis", "Databases", ["redis-server"]),
    ("Cassandra", "Databases", ["apache cassandra"]),
    ("Elasticsearch", "Databases", ["elastic", "elk stack"]),
    ("Neo4j", "Databases", ["neo4j graph"]),
    ("Snowflake", "Databases", ["snowflake dw"]),
    ("BigQuery", "Databases", ["google bigquery", "bq"]),
    ("DynamoDB", "Databases", ["aws dynamodb"]),

    # Cloud & DevOps
    ("Docker", "DevOps", ["docker container", "dockerfile", "containerization"]),
    ("Kubernetes", "DevOps", ["k8s", "kubernetes cluster"]),
    ("Git", "DevOps", ["git version control", "version control"]),
    ("GitHub", "DevOps", ["github", "gh"]),
    ("GitLab", "DevOps", ["gitlab"]),
    ("GitHub Actions", "DevOps", ["gh actions", "github ci"]),
    ("CI/CD", "DevOps", ["continuous integration", "continuous delivery"]),
    ("AWS", "Cloud", ["amazon web services", "aws cloud"]),
    ("AWS S3", "Cloud", ["s3", "simple storage service"]),
    ("AWS EC2", "Cloud", ["ec2", "elastic compute cloud"]),
    ("AWS Lambda", "Cloud", ["lambda", "serverless lambda"]),
    ("AWS SageMaker", "Cloud", ["sagemaker"]),
    ("GCP", "Cloud", ["google cloud", "google cloud platform"]),
    ("GCP Vertex AI", "Cloud", ["vertex ai"]),
    ("Azure", "Cloud", ["microsoft azure"]),
    ("Terraform", "DevOps", ["hashicorp terraform"]),
    ("Linux", "DevOps", ["ubuntu", "debian", "centos", "redhat"]),
    ("Nginx", "DevOps", ["nginx reverse proxy"]),

    # MLOps & Data Engineering
    ("MLflow", "MLOps", ["mlflow tracking", "mlflow registry"]),
    ("Kubeflow", "MLOps", ["kubeflow pipelines"]),
    ("Weights & Biases", "MLOps", ["wandb", "w&b"]),
    ("DVC", "MLOps", ["data version control", "dvc"]),
    ("Airflow", "Data", ["apache airflow"]),
    ("Apache Spark", "Data", ["spark", "pyspark"]),
    ("Kafka", "Data", ["apache kafka"]),
    ("dbt", "Data", ["data build tool"]),

    # Business Intelligence & Tools
    ("Tableau", "Tool", ["tableau desktop"]),
    ("Power BI", "Tool", ["powerbi", "microsoft power bi"]),
    ("Excel", "Tool", ["ms excel", "spreadsheets"]),
    ("Jupyter", "Tool", ["jupyter notebook", "jupyterlab"]),
    ("VS Code", "Tool", ["visual studio code", "vscode"]),
    ("Postman", "Tool", ["postman api"]),
    ("PyTest", "Tool", ["pytest", "unittest"]),

    # Concepts & Methodologies
    ("A/B Testing", "Concept", ["ab testing", "split testing", "hypothesis testing"]),
    ("Data Cleaning", "Concept", ["data preprocessing", "data wrangling"]),
    ("Feature Engineering", "Concept", ["feature selection", "feature scaling"]),
    ("Object-Oriented Programming", "Concept", ["oop", "object oriented"]),
    ("Agile/Scrum", "Concept", ["agile", "scrum", "kanban"]),
    ("Microservices", "Concept", ["microservice architecture"]),
    ("ETL", "Concept", ["extract transform load", "elt"]),
]

KNOWLEDGE_DOCS_SEED = [
    {
        "category": "career_guidance",
        "title": "Transitioning from Entry AI to Production AI Engineer",
        "source_ref": "CareerLens AI Guidance Series #1",
        "content": (
            "To advance from basic academic machine learning to an industry-ready AI Engineer, "
            "focus on three critical missing pillars: 1) Containerization (Docker), 2) High-performance "
            "REST APIs (FastAPI/Uvicorn), and 3) Quantitative evaluation under production constraints. "
            "Recruiters look for candidates who can take a model beyond a Jupyter notebook and serve it "
            "with sub-100ms latency, monitoring for data drift and memory usage."
        ),
        "metadata": {"tags": ["AI Engineer", "Docker", "FastAPI", "Career Transition"]}
    },
    {
        "category": "technology_guide",
        "title": "Modern Vector Databases and RAG Architecture",
        "source_ref": "CareerLens AI Tech Blueprint #4",
        "content": (
            "Retrieval-Augmented Generation (RAG) grounds LLM responses on proprietary knowledge. "
            "Key architectural components include document extraction, semantic chunking (typically 300-600 tokens "
            "with 50-token overlap), embedding generation (e.g. OpenAI text-embedding-3 or HuggingFace BGE), "
            "and cosine similarity search via pgvector or dedicated vector stores like Pinecone or Qdrant."
        ),
        "metadata": {"tags": ["RAG", "pgvector", "Embeddings", "LLM"]}
    },
    {
        "category": "interview_question",
        "title": "Handling Class Imbalance in Production Classifiers",
        "source_ref": "CareerLens Interview Prep Bank",
        "content": (
            "When encountering severe class imbalance (e.g., 98% negative vs 2% positive), traditional accuracy "
            "becomes a misleading metric. Key techniques: 1) Resampling (SMOTE oversampling or stratified undersampling), "
            "2) Cost-sensitive learning (class weights in loss function), 3) Metric re-alignment focusing on PR-AUC, "
            "Precision, Recall, and F1-score rather than ROC-AUC or raw accuracy."
        ),
        "metadata": {"tags": ["Machine Learning", "Interview", "Evaluation Metrics", "Imbalance"]}
    }
]

def seed_database():
    """Initializes tables and populates foundational seed data."""
    init_db()
    db = SessionLocal()

    try:
        # 1. Seed Skills
        existing_skills = {s.canonical_name: s for s in db.query(Skill).all()}
        skill_map = {}

        for canonical_name, category, aliases in TAXONOMY_SKILLS:
            if canonical_name in existing_skills:
                skill_map[canonical_name] = existing_skills[canonical_name]
            else:
                new_skill = Skill(
                    id=str(uuid.uuid4()),
                    canonical_name=canonical_name,
                    category=category,
                    aliases=aliases,
                )
                db.add(new_skill)
                skill_map[canonical_name] = new_skill

        db.commit()

        # 2. Seed Job Roles & Mappings
        existing_roles = {r.role_code: r for r in db.query(JobRole).all()}

        for role_data in JOB_ROLES_SEED:
            role_code = role_data["role_code"]
            role = existing_roles.get(role_code)
            if not role:
                role = JobRole(
                    id=str(uuid.uuid4()),
                    role_code=role_code,
                    display_name=role_data["display_name"],
                    category=role_data["category"],
                    description=role_data["description"],
                    experience_expectations=role_data["experience_expectations"],
                    common_tools=role_data["common_tools"],
                    project_expectations=role_data["project_expectations"],
                    interview_topics=role_data["interview_topics"],
                    required_skills=role_data["required_skills"],
                    preferred_skills=role_data["preferred_skills"],
                )
                db.add(role)
                db.flush()

            # Seed Job Role Skills
            existing_role_skills = {
                rs.skill_id for rs in db.query(JobRoleSkill).filter_by(job_role_id=role.id).all()
            }

            for s_name in role_data["required_skills"]:
                s = skill_map.get(s_name)
                if s and s.id not in existing_role_skills:
                    db.add(JobRoleSkill(
                        id=str(uuid.uuid4()),
                        job_role_id=role.id,
                        skill_id=s.id,
                        is_required=True,
                        weight=1.5,
                        importance="critical"
                    ))

            for s_name in role_data["preferred_skills"]:
                s = skill_map.get(s_name)
                if s and s.id not in existing_role_skills:
                    db.add(JobRoleSkill(
                        id=str(uuid.uuid4()),
                        job_role_id=role.id,
                        skill_id=s.id,
                        is_required=False,
                        weight=1.0,
                        importance="medium"
                    ))

        db.commit()

        # 3. Seed Knowledge Documents & Chunks
        for kdoc in KNOWLEDGE_DOCS_SEED:
            existing_doc = db.query(KnowledgeDocument).filter_by(title=kdoc["title"]).first()
            if not existing_doc:
                doc = KnowledgeDocument(
                    id=str(uuid.uuid4()),
                    category=kdoc["category"],
                    title=kdoc["title"],
                    source_ref=kdoc["source_ref"],
                    metadata_payload=kdoc["metadata"]
                )
                db.add(doc)
                db.flush()

                chunk = DocumentChunk(
                    id=str(uuid.uuid4()),
                    document_id=doc.id,
                    chunk_index=0,
                    content=kdoc["content"],
                    metadata_payload=kdoc["metadata"]
                )
                db.add(chunk)

        db.commit()
        print(f"Seed completed successfully: {len(JOB_ROLES_SEED)} roles, {len(TAXONOMY_SKILLS)} skills, knowledge docs seeded.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
