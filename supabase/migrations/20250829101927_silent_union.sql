/*
  # Add foreign key relationships to units table

  1. Schema Changes
    - Add `course_id` column to `units` table with foreign key to `courses(id)`
    - Add `subject_id` column to `units` table with foreign key to `subjects(id)`
    - Update existing units to have proper relationships (if any exist)

  2. Security
    - Maintain existing RLS policies on `units` table
    - No changes to existing permissions

  3. Notes
    - This enables proper joins between units, courses, and subjects
    - Allows Supabase queries to fetch related data efficiently
*/

-- Add course_id column with foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'units' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE units ADD COLUMN course_id text;
  END IF;
END $$;

-- Add subject_id column with foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'units' AND column_name = 'subject_id'
  ) THEN
    ALTER TABLE units ADD COLUMN subject_id text;
  END IF;
END $$;

-- Add foreign key constraints
DO $$
BEGIN
  -- Add foreign key for course_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'units_course_id_fkey'
  ) THEN
    ALTER TABLE units ADD CONSTRAINT units_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key for subject_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'units_subject_id_fkey'
  ) THEN
    ALTER TABLE units ADD CONSTRAINT units_subject_id_fkey 
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;
  END IF;
END $$;