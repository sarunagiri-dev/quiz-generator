/**
 * Quiz Service
 * Handles quiz generation logic and mock quiz data
 */

/**
 * Generates topic-specific mock quiz questions
 * @param {string} topic - The quiz topic
 * @returns {Array} Array of quiz questions with explanations
 */
const generateMockQuiz = (topic) => {
  const topicLower = topic.toLowerCase();
  
  const mathQuiz = [
    { 
      question: "What is 2 + 2?", 
      options: ["3", "4", "5", "6"], 
      correctOptionIndex: 1, 
      explanation: "2 + 2 = 4. This is basic addition." 
    },
    { 
      question: "What is the square root of 16?", 
      options: ["2", "3", "4", "5"], 
      correctOptionIndex: 2,
      explanation: "√16 = 4 because 4 × 4 = 16."
    },
    { 
      question: "What is 5 × 3?", 
      options: ["12", "15", "18", "20"], 
      correctOptionIndex: 1,
      explanation: "5 × 3 = 15. This is basic multiplication."
    },
    { 
      question: "What is 10 ÷ 2?", 
      options: ["3", "4", "5", "6"], 
      correctOptionIndex: 2,
      explanation: "10 ÷ 2 = 5. This is basic division."
    },
    { 
      question: "What is 7 - 3?", 
      options: ["3", "4", "5", "6"], 
      correctOptionIndex: 1,
      explanation: "7 - 3 = 4. This is basic subtraction."
    }
  ];

  const scienceQuiz = [
    { 
      question: "What is the speed of light?", 
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], 
      correctOptionIndex: 0, 
      explanation: "The speed of light in vacuum is approximately 299,792,458 meters per second, or about 300,000 km/s." 
    },
    { 
      question: "What is the chemical symbol for water?", 
      options: ["H2O", "CO2", "O2", "N2"], 
      correctOptionIndex: 0,
      explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O."
    },
    { 
      question: "How many planets are in our solar system?", 
      options: ["7", "8", "9", "10"], 
      correctOptionIndex: 1,
      explanation: "There are 8 planets in our solar system since Pluto was reclassified as a dwarf planet in 2006."
    },
    { 
      question: "What gas do plants absorb from the atmosphere?", 
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], 
      correctOptionIndex: 2,
      explanation: "Plants absorb carbon dioxide (CO2) during photosynthesis to produce glucose and oxygen."
    },
    { 
      question: "What is the hardest natural substance?", 
      options: ["Gold", "Iron", "Diamond", "Silver"], 
      correctOptionIndex: 2,
      explanation: "Diamond is the hardest natural substance, rating 10 on the Mohs hardness scale."
    }
  ];

  // Topic-specific quiz selection
  if (topicLower.includes('math') || topicLower.includes('algebra')) {
    return mathQuiz;
  }
  
  if (topicLower.includes('science') || topicLower.includes('physics') || topicLower.includes('chemistry')) {
    return scienceQuiz;
  }
  
  // Default generic quiz
  return [
    { 
      question: `What is a key concept in ${topic}?`, 
      options: ["Option A", "Option B", "Option C", "Option D"], 
      correctOptionIndex: 0, 
      explanation: `This is a fundamental concept in ${topic}.` 
    },
    { 
      question: `Which statement about ${topic} is true?`, 
      options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"], 
      correctOptionIndex: 1,
      explanation: `This statement accurately describes an aspect of ${topic}.`
    },
    { 
      question: `How does ${topic} relate to other subjects?`, 
      options: ["Relation A", "Relation B", "Relation C", "Relation D"], 
      correctOptionIndex: 2,
      explanation: `${topic} has interdisciplinary connections with various fields.`
    },
    { 
      question: `What is an important application of ${topic}?`, 
      options: ["Application A", "Application B", "Application C", "Application D"], 
      correctOptionIndex: 3,
      explanation: `This represents a practical application of ${topic} principles.`
    },
    { 
      question: `Which best describes ${topic}?`, 
      options: ["Description A", "Description B", "Description C", "Description D"], 
      correctOptionIndex: 0,
      explanation: `This description captures the essence of ${topic}.`
    }
  ];
};

module.exports = {
  generateMockQuiz
};