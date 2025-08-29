/*
  # Add topics to Introduction to Human Body unit

  1. Updates
    - Add comprehensive lesson topics to the "Introduction to Human Body" unit
    - Topics cover basic human anatomy systems
    - Each topic includes structured content with key points

  2. Content Added
    - Body Systems Overview
    - Skeletal System
    - Muscular System  
    - Circulatory System
    - Respiratory System
    - Digestive System
    - Nervous System
*/

-- Update the Introduction to Human Body unit with comprehensive topics
UPDATE units 
SET lessons = '[
  {
    "id": "lesson-1",
    "title": "Body Systems Overview",
    "content": "<h3>Human Body Systems</h3><ul><li>The human body is made up of several interconnected systems</li><li>Each system has specific functions that keep us alive and healthy</li><li>Systems work together to maintain homeostasis</li><li>Major systems include skeletal, muscular, circulatory, respiratory, digestive, and nervous</li><li>Understanding these systems helps us take better care of our bodies</li></ul>"
  },
  {
    "id": "lesson-2", 
    "title": "Skeletal System",
    "content": "<h3>The Framework of Our Body</h3><ul><li>The skeletal system consists of 206 bones in adults</li><li>Bones provide structure and support for the body</li><li>Bones protect vital organs like the brain and heart</li><li>Bone marrow produces blood cells</li><li>Joints allow movement between bones</li><li>Calcium and vitamin D are essential for strong bones</li></ul>"
  },
  {
    "id": "lesson-3",
    "title": "Muscular System", 
    "content": "<h3>Movement and Strength</h3><ul><li>There are over 600 muscles in the human body</li><li>Three types of muscles: skeletal, cardiac, and smooth</li><li>Skeletal muscles are voluntary and help us move</li><li>Cardiac muscle pumps blood through the heart</li><li>Smooth muscles work automatically in organs</li><li>Exercise helps keep muscles strong and healthy</li></ul>"
  },
  {
    "id": "lesson-4",
    "title": "Circulatory System",
    "content": "<h3>Transportation Network</h3><ul><li>The heart pumps blood throughout the body</li><li>Blood carries oxygen and nutrients to cells</li><li>Blood vessels include arteries, veins, and capillaries</li><li>Red blood cells carry oxygen</li><li>White blood cells fight infections</li><li>The heart beats about 100,000 times per day</li></ul>"
  },
  {
    "id": "lesson-5",
    "title": "Respiratory System",
    "content": "<h3>Breathing and Gas Exchange</h3><ul><li>We breathe in oxygen and breathe out carbon dioxide</li><li>The lungs contain millions of tiny air sacs called alveoli</li><li>The diaphragm muscle helps us breathe</li><li>Oxygen enters the blood through the lungs</li><li>We take about 20,000 breaths per day</li><li>Exercise improves lung capacity and efficiency</li></ul>"
  },
  {
    "id": "lesson-6",
    "title": "Digestive System",
    "content": "<h3>Breaking Down Food</h3><ul><li>Digestion begins in the mouth with chewing and saliva</li><li>The stomach uses acid to break down food</li><li>The small intestine absorbs most nutrients</li><li>The large intestine processes waste</li><li>The liver produces bile to help digest fats</li><li>Good nutrition provides energy and building materials for the body</li></ul>"
  },
  {
    "id": "lesson-7",
    "title": "Nervous System",
    "content": "<h3>Control and Communication</h3><ul><li>The brain is the control center of the body</li><li>The spinal cord connects the brain to the rest of the body</li><li>Nerves carry messages throughout the body</li><li>The nervous system controls both voluntary and involuntary actions</li><li>Reflexes help protect us from danger</li><li>Sleep is important for brain health and memory</li></ul>"
  }
]'
WHERE title = 'Introduction to Human Body';