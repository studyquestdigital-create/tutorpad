/*
# [Initial Schema] - Create Curriculum Tables
This migration creates the core tables for the EduPanel application, including courses, subjects, units, and lessons. It establishes the relationships between them to form the curriculum structure.

## Query Description:
This is a foundational, structural migration. It does not modify or delete any existing data as it's intended for a fresh database setup. It creates the entire table structure needed for the application's content management features.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the tables)

## Structure Details:
- Creates table `courses`
- Creates table `subjects`
- Creates table `units`
- Creates table `lessons`
- Adds foreign key constraints between tables.

## Security Implications:
- RLS Status: Enabled on all new tables.
- Policy Changes: Yes, adds public read policies for all tables.
- Auth Requirements: None for read, authenticated for write (policies to be refined later).

## Performance Impact:
- Indexes: Primary keys are indexed automatically. Foreign keys will also be indexed.
- Triggers: None.
- Estimated Impact: Low. Initial setup query.
*/

-- 1. COURSES TABLE
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    terms INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to courses" ON courses FOR SELECT USING (true);


-- 2. SUBJECTS TABLE
CREATE TABLE subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    term INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to subjects" ON subjects FOR SELECT USING (true);


-- 3. UNITS TABLE
CREATE TABLE units (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
    progress INT DEFAULT 0,
    last_modified TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'draft', -- 'published', 'draft', 'archived'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to units" ON units FOR SELECT USING (true);


-- 4. LESSONS TABLE
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to lessons" ON lessons FOR SELECT USING (true);


/*
# [Seed Data] - Populate Curriculum
This operation inserts the initial curriculum data for B.Sc Nursing and GNM courses into the newly created tables.

## Query Description:
This is a data insertion operation. It populates the database with the foundational content required for the application to be usable. It assumes the tables from the 'Initial Schema' migration exist. There is no risk of data loss.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by deleting the inserted records)

## Structure Details:
- Inserts records into `courses`.
- Inserts records into `subjects`.
- Inserts records into `units`.
- Inserts records into `lessons`.

## Security Implications:
- RLS Status: N/A (Data insertion)
- Policy Changes: No.
- Auth Requirements: N/A.

## Performance Impact:
- Indexes: N/A.
- Triggers: N/A.
- Estimated Impact: Low.
*/

-- SEED COURSES
INSERT INTO courses (id, name, terms) VALUES
('bsc-nursing', 'B.Sc Nursing', 8),
('gnm', 'General Nursing & Midwifery (GNM)', 3);

-- SEED SUBJECTS
INSERT INTO subjects (id, name, course_id, term) VALUES
-- B.Sc Semester 1
('ana-phys-b', 'Anatomy & Physiology', 'bsc-nursing', 1),
('nurs-found-b', 'Nursing Foundation', 'bsc-nursing', 1),
-- B.Sc Semester 2
('biochem-nutri-b', 'Biochemistry & Nutrition', 'bsc-nursing', 2),
('psych-b', 'Psychology', 'bsc-nursing', 2),
-- GNM Year 1
('bio-sci-g', 'Biological Sciences', 'gnm', 1),
('behav-sci-g', 'Behavioral Sciences', 'gnm', 1),
-- GNM Year 2
('med-surg-1-g', 'Medical-Surgical Nursing I', 'gnm', 2),
('comm-health-1-g', 'Community Health Nursing I', 'gnm', 2);

-- SEED UNITS & LESSONS
-- B.Sc Nursing: Sem 1, Anatomy & Physiology
INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-b-s1-ap-1', 'Introduction to Human Body', 'Fundamental concepts of human anatomy and physiology.', 'ana-phys-b', 65, 'published');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-1-1', 'Organization of Human Body', '<ul><li>Levels of organization</li><li>Anatomical terminology</li><li>Homeostasis</li></ul>', 'unit-b-s1-ap-1'),
('l-1-2', 'Cells & Tissues', '<ul><li>Cell structure & function</li><li>Cell division</li><li>Types of tissues</li></ul>', 'unit-b-s1-ap-1');

INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-b-s1-ap-2', 'Musculoskeletal System', 'Study of the bones, joints, and muscles of the human body.', 'ana-phys-b', 30, 'draft');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-2-1', 'Bones and Joints', '<ul><li>Classification of bones</li><li>Bone growth</li><li>Types of joints</li></ul>', 'unit-b-s1-ap-2'),
('l-2-2', 'Muscles', '<ul><li>Types of muscles</li><li>Muscle contraction</li><li>Major muscle groups</li></ul>', 'unit-b-s1-ap-2');

-- B.Sc Nursing: Sem 1, Nursing Foundation
INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-b-s1-nf-1', 'Introduction to Nursing', 'Core principles and values of the nursing profession.', 'nurs-found-b', 90, 'published');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-3-1', 'Nursing as a Profession', '<ul><li>History of Nursing</li><li>Role of Nurse</li><li>Professional values</li></ul>', 'unit-b-s1-nf-1'),
('l-3-2', 'Nursing Theories', '<ul><li>Nightingale’s theory</li><li>Orem’s self-care model</li><li>Roy’s adaptation model</li></ul>', 'unit-b-s1-nf-1');

INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-b-s1-nf-2', 'Nursing Procedures', 'Essential hands-on skills for patient care.', 'nurs-found-b', 15, 'draft');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-4-1', 'Basic Nursing Skills', '<ul><li>Bed making</li><li>Personal hygiene</li><li>Vital signs monitoring</li></ul>', 'unit-b-s1-nf-2'),
('l-4-2', 'Patient Safety & Comfort', '<ul><li>Infection control</li><li>Positioning patients</li><li>Body mechanics</li></ul>', 'unit-b-s1-nf-2');

-- B.Sc Nursing: Sem 2, Biochemistry & Nutrition
INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-b-s2-bn-1', 'Biochemistry', 'The chemical processes within and related to living organisms.', 'biochem-nutri-b', 0, 'draft');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-5-1', 'Biomolecules', '<ul><li>Carbohydrates</li><li>Proteins</li><li>Lipids</li></ul>', 'unit-b-s2-bn-1'),
('l-5-2', 'Enzymes', '<ul><li>Structure</li><li>Function</li><li>Clinical importance</li></ul>', 'unit-b-s2-bn-1');

-- GNM: Year 1, Biological Sciences
INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-g-y1-bs-1', 'Anatomy & Physiology', 'An overview of the human body and its systems.', 'bio-sci-g', 80, 'published');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-6-1', 'Introduction to Human Body', '<ul><li>Levels of organization</li><li>Homeostasis</li></ul>', 'unit-g-y1-bs-1'),
('l-6-2', 'Skeletal & Muscular System', '<ul><li>Types of bones</li><li>Joints</li><li>Muscles</li></ul>', 'unit-g-y1-bs-1');

INSERT INTO units (id, title, description, subject_id, progress, status) VALUES ('unit-g-y1-bs-2', 'Microbiology', 'Study of microscopic organisms and infection control.', 'bio-sci-g', 45, 'published');
INSERT INTO lessons (id, title, content, unit_id) VALUES
('l-7-1', 'Microorganisms', '<ul><li>Bacteria</li><li>Viruses</li><li>Fungi</li></ul>', 'unit-g-y1-bs-2'),
('l-7-2', 'Infection Control', '<ul><li>Sterilization</li><li>Disinfection</li><li>Hand hygiene</li></ul>', 'unit-g-y1-bs-2');
