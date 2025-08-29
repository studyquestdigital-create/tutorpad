/*
  # Create lessons table and update human body unit

  1. New Tables
    - `lessons`
      - `id` (text, primary key)
      - `title` (text, not null)
      - `content` (text)
      - `unit_id` (text, foreign key to units)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `lessons` table
    - Add policy for public read access to lessons

  3. Data
    - Add sample lessons for "Introduction to Human Body" unit
*/

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text,
  unit_id text REFERENCES units(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Allow public read access to lessons"
  ON lessons
  FOR SELECT
  TO public
  USING (true);

-- Add sample lessons for Introduction to Human Body unit
INSERT INTO lessons (id, title, content, unit_id) VALUES
  ('lesson-1', 'Overview of Human Body Systems', '<h3>Human Body Systems Overview</h3><ul><li>The human body consists of 11 major organ systems</li><li>Each system has specific functions and organs</li><li>Systems work together to maintain homeostasis</li><li>Understanding body systems helps us appreciate human biology</li></ul>', 'intro-human-body'),
  ('lesson-2', 'Skeletal System', '<h3>The Skeletal System</h3><ul><li>206 bones in the adult human body</li><li>Provides structure and support</li><li>Protects vital organs</li><li>Produces blood cells in bone marrow</li><li>Stores minerals like calcium and phosphorus</li></ul>', 'intro-human-body'),
  ('lesson-3', 'Muscular System', '<h3>The Muscular System</h3><ul><li>Over 600 muscles in the human body</li><li>Three types: skeletal, cardiac, and smooth muscle</li><li>Enables movement and locomotion</li><li>Maintains posture and body position</li><li>Generates heat to maintain body temperature</li></ul>', 'intro-human-body'),
  ('lesson-4', 'Circulatory System', '<h3>The Circulatory System</h3><ul><li>Heart pumps blood throughout the body</li><li>Blood vessels: arteries, veins, and capillaries</li><li>Transports oxygen, nutrients, and waste products</li><li>Helps regulate body temperature</li><li>Supports immune system function</li></ul>', 'intro-human-body'),
  ('lesson-5', 'Respiratory System', '<h3>The Respiratory System</h3><ul><li>Primary function is gas exchange</li><li>Includes lungs, trachea, bronchi, and alveoli</li><li>Brings oxygen into the body</li><li>Removes carbon dioxide waste</li><li>Helps maintain pH balance in blood</li></ul>', 'intro-human-body'),
  ('lesson-6', 'Digestive System', '<h3>The Digestive System</h3><ul><li>Breaks down food into nutrients</li><li>Includes mouth, stomach, intestines, and liver</li><li>Absorbs nutrients into bloodstream</li><li>Eliminates waste products</li><li>Produces enzymes for digestion</li></ul>', 'intro-human-body'),
  ('lesson-7', 'Nervous System', '<h3>The Nervous System</h3><ul><li>Controls and coordinates body functions</li><li>Brain, spinal cord, and peripheral nerves</li><li>Processes sensory information</li><li>Controls voluntary and involuntary actions</li><li>Enables learning, memory, and emotions</li></ul>', 'intro-human-body');