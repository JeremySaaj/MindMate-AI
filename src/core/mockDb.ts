/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core shared state engine and mock database
// Seeded with rich content to demonstrate robust Student and Teacher flows out of the box.

import { 
  Course, Module, Material, ModuleQuiz, 
  MaterialProgress, AIQuizAttempt, AnalyticsEvent, User, TopicOutline, TopicExplanation,
  TopicPerformanceDetail, TeachingRecommendation
} from './types';

// Default mock users
export const DEFAULT_USERS: User[] = [
  { id: 'u1', email: 'student@mindmate.edu', role: 'student', name: 'Alex Johnson' },
  { id: 'u2', email: 'teacher@mindmate.edu', role: 'teacher', name: 'Dr. Sarah Jenkins' },
  { id: 'u3', email: 'admin@mindmate.edu', role: 'admin', name: 'System Admin' }
];

// Rich seed material content for our Machine Learning course
const ML_MATERIAL_CONTENT_1 = `
Introduction to Artificial Neural Networks

An Artificial Neural Network (ANN) is a computing system inspired by the biological neural networks that constitute animal brains. The neural network itself is not an algorithm, but rather a framework for many different machine learning algorithms to work together and process complex data inputs.

1. Biological vs. Artificial Neurons
The fundamental building block of an ANN is the artificial neuron, sometimes called a node or perceptron. It receives inputs (akin to biological dendrites), multiplies each input by a weight (representing synaptic strength), sums these weighted inputs along with a constant bias, and then passes the result through an activation function to produce an output (representing a biological axon transmission).

Mathematically: y = f( Sum(x_i * w_i) + bias )

2. Network Layers
Neural networks are structured in layers:
- Input Layer: Receives raw features. For example, pixels of an image or values in a spreadsheet.
- Hidden Layers: Intermediate computation layers that extract abstract features. A "deep" network typically has multiple hidden layers. 
- Output Layer: Produces the final prediction, such as a category label (classification) or a continuous number (regression).

3. The Hidden Layers and Representation Learning
As information passes through deeper hidden layers, the network learns increasingly complex concepts. In facial recognition, the first layer might detect simple edges, the second detects parts of a face (eyes, nose), and the final hidden layer detects full faces. This automatic feature extraction is known as representation learning, and is what makes neural networks so powerful.

4. Activation Functions: Non-linearity
An activation function determines whether a neuron should be activated. It introduces non-linear properties to the network. Without non-linear activation functions, a network with any number of layers behaves exactly like a single-layer linear regression model. Common activation functions include:
- ReLU (Rectified Linear Unit): f(x) = max(0, x). It is the most popular hidden layer activation function due to its computational efficiency.
- Sigmoid: f(x) = 1 / (1 + e^-x). Used in binary classification to map output to a probability between 0 and 1.
- Softmax: Used in multi-class classification output layers to create a normalized probability distribution.

5. Training: Forward and Backward Propagation
Training a network involves two key phases:
- Forward Propagation: Inputs are fed forward to calculate an model-predicted output.
- Loss/Error Calculation: A loss function compares the predicted output to the true target, outputting an error value.
- Backpropagation (Backward Propagation): The error is propagated backward through the network. We calculate the gradient of the loss function with respect to each weight using the Chain Rule of calculus.
- Optimization (e.g., Gradient Descent): The weights are carefully updated in the opposite direction of the gradient to reduce future error.

This iterative process of scanning batches of training examples, calculating loss, backpropagating errors, and updating weights is called training. Over thousands of iterations (epochs), the error drops, and the network achieves high prediction accuracy.
`;

const ML_MATERIAL_CONTENT_2 = `
Understanding Loss Functions and Gradient Descent

In machine learning, training a model is essentially an optimization problem: we want to find the parameter values (weights and biases) that make the model's predictions as accurate as possible. To do this, we need a way to measure inaccuracy and a systematic method to improve.

1. What is a Loss Function?
A loss function (or cost function) measures how well a machine learning model fits the training data. It outputs a single number that quantifies the difference between the model's predictions (y-hat) and the actual ground truth answers (y).

The goal of our training loop is simple: minimize the output value of the loss function.

2. Common Loss Functions
Different tasks require different loss functions:
- Mean Squared Error (MSE): Typically used for Regression tasks (predicting real numbers). It calculates the average of the squared differences between predictions and actual values.
- Binary Cross-Entropy (BCE): Used for binary classification (Yes/No tasks). It measures the dissimilarity between true binary classes and predicted probabilities.
- Categorical Cross-Entropy (CCE): Used for multi-class classification. It compares the true category distribution with the softmax probability distribution from the model.

3. The Optimization Concept
If you think of the loss function as a landscape of hills (high error) and valleys (low error), optimizing a model corresponds to finding the lowest point in the landscape. Each combination of model weights corresponds to a specific point on this terrain.

4. Introduction to Gradient Descent
Gradient Descent is the primary optimization algorithm used to minimize loss. It is an iterative optimization process that approaches the minimum of the loss function by taking steps proportional to the negative of the gradient of the function.

Analogy: Imagine being lost in the fog on a mountain. You cannot see the lowest valley, but you can feel the slope of the ground beneath your feet. To find the valley, a safe strategy is to walk down in the direction where the ground slopes down most steeply.

5. Parameters of Gradient Descent:
- Weight Update: W_new = W_old - (Learning_Rate * Gradient).
- The Learning Rate (Alpha): This specifies the size of the step we take. If the learning rate is too small, gradient descent will take incredibly long to converge. If the learning rate is too large, the algorithm can overshoot the valley entirely, fail to converge, and even cause the loss to diverge.
- Local Minima vs. Global Minimum: In complex high-dimensional landscapes, a model might get trapped in "local minima" (shallow valleys that aren't the absolute lowest point). Advanced optimizers (like Adam, RMSprop, or SGD with Momentum) help the model roll over small bumps to find deeper, better valleys.
`;

// Initial mock database state
const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Machine Learning',
    synopsis: 'Learn the foundational math, concepts, neural architectures, loss functions, and optimization strategies utilized in modern artificial intelligence systems.',
    teacherId: 'u2',
    teacherName: 'Dr. Sarah Jenkins',
    publishStatus: 'published'
  },
  {
    id: 'c2',
    title: 'Python for Data Science',
    synopsis: 'Master Numpy, Pandas, Matplotlib, and data preparation techniques. Ideal for developers wanting to transition into heavy analytical work.',
    teacherId: 'u2',
    teacherName: 'Dr. Sarah Jenkins',
    publishStatus: 'published'
  }
];

const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    courseId: 'c1',
    title: 'Module 1: Foundations of Artificial Neural Networks',
    order: 1,
    publishStatus: 'published'
  },
  {
    id: 'm2',
    courseId: 'c1',
    title: 'Module 2: Supervision, Loss, and Gradient Descent Optimizer',
    order: 2,
    publishStatus: 'published'
  },
  {
    id: 'm3',
    courseId: 'c2',
    title: 'Module 1: Data Structuring & Arrays',
    order: 1,
    publishStatus: 'published'
  }
];

const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat1',
    moduleId: 'm1',
    courseId: 'c1',
    title: 'Deep Dive: Understanding Neurons and Network Architectures',
    fileType: 'text',
    fileContent: ML_MATERIAL_CONTENT_1,
    pageCount: 3,
    publishStatus: 'published',
    order: 1
  },
  {
    id: 'mat2',
    moduleId: 'm2',
    courseId: 'c1',
    title: 'Mathematical Optimization: Loss Functions and Gradient Descent',
    fileType: 'pdf',
    fileContent: ML_MATERIAL_CONTENT_2,
    pageCount: 4,
    publishStatus: 'published',
    order: 1
  }
];

const INITIAL_QUIZZES: ModuleQuiz[] = [
  {
    id: 'q1',
    moduleId: 'm1',
    courseId: 'c1',
    questions: [
      {
        questionText: 'Which function is commonly used in binary classification output layers to map predictions to probability?',
        options: ['ReLU activation', 'Sigmoid activation', 'Linear function', 'Vector multiplication'],
        correctOptionIndex: 1
      },
      {
        questionText: 'What mathematical concept is used to compute gradients backward during Backpropagation?',
        options: ['The Product Rule', 'The Chain Rule of calculus', 'Matrix inversion', 'Integration by parts'],
        correctOptionIndex: 1
      }
    ],
    publishStatus: 'published'
  }
];

// Pre-seeded Student analytics log to show a rich teacher analytics panel out of the box
const INITIAL_ANALYTICS_EVENTS: AnalyticsEvent[] = [
  { id: 'e1', eventType: 'material_visit', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', studentId: 'u1', timestamp: '2026-06-05T10:00:00Z' },
  { id: 'e2', eventType: 'ai_help_request', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'activation_functions', studentId: 'u1', value: 'Why do we need activation functions?', timestamp: '2026-06-05T10:15:00Z' },
  { id: 'e3', eventType: 'ai_help_request', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'activation_functions', studentId: 'stu2', value: 'What happens if we remove ReLU?', timestamp: '2026-06-05T12:30:00Z' },
  { id: 'e4', eventType: 'ai_help_request', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'backpropagation', studentId: 'stu3', value: 'I don\'t understand backpropagation calculus.', timestamp: '2026-06-05T14:10:00Z' },
  { id: 'e5', eventType: 'quiz_attempt', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'activation_functions', studentId: 'u1', value: { level: 1, score: 5, passed: true }, timestamp: '2026-06-05T10:25:00Z' },
  { id: 'e6', eventType: 'quiz_attempt', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'backpropagation', studentId: 'u1', value: { level: 2, score: 2, passed: false }, timestamp: '2026-06-05T10:40:00Z' },
  { id: 'e7', eventType: 'quiz_attempt', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'backpropagation', studentId: 'stu2', value: { level: 2, score: 3, passed: false }, timestamp: '2026-06-05T13:00:00Z' },
  { id: 'e8', eventType: 'quiz_attempt', courseId: 'c1', moduleId: 'm1', materialId: 'mat1', topicId: 'backpropagation', studentId: 'stu3', value: { level: 2, score: 1, passed: false }, timestamp: '2026-06-05T15:20:00Z' }
];

const INITIAL_TOPIC_PERFORMANCES: TopicPerformanceDetail[] = [
  {
    topicId: 'backpropagation',
    topicTitle: 'Backpropagation and Derivative Gradients',
    courseTitle: 'Introduction to Machine Learning',
    avgScore: 2.1,
    attempts: 6,
    aiQuestions: 4,
    failureRate: 66,
    status: 'Needs Attention'
  },
  {
    topicId: 'activation_functions',
    topicTitle: 'Activation Functions and Non-Linearities',
    courseTitle: 'Introduction to Machine Learning',
    avgScore: 4.2,
    attempts: 4,
    aiQuestions: 8,
    failureRate: 25,
    status: 'Fair'
  },
  {
    topicId: 'gradient_descent',
    topicTitle: 'Learning Rates and Gradient descent optimization',
    courseTitle: 'Introduction to Machine Learning',
    avgScore: 3.5,
    attempts: 8,
    aiQuestions: 3,
    failureRate: 37,
    status: 'Below Average'
  }
];

// Helper functions to get/set state from localStorage
const getStored = <T>(key: string, defaults: T): T => {
  if (typeof window === 'undefined') return defaults;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(val);
  } catch (e) {
    return defaults;
  }
};

const setStored = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
};

// State Store Singleton
export class MockDatabase {
  static getCourses(): Course[] {
    return getStored('mindmate_courses', INITIAL_COURSES);
  }

  static saveCourses(courses: Course[]): void {
    setStored('mindmate_courses', courses);
  }

  static getModules(): Module[] {
    return getStored('mindmate_modules', INITIAL_MODULES);
  }

  static saveModules(modules: Module[]): void {
    setStored('mindmate_modules', modules);
  }

  static getMaterials(): Material[] {
    return getStored('mindmate_materials', INITIAL_MATERIALS);
  }

  static saveMaterials(materials: Material[]): void {
    setStored('mindmate_materials', materials);
  }

  static getQuizzes(): ModuleQuiz[] {
    return getStored('mindmate_quizzes', INITIAL_QUIZZES);
  }

  static saveQuizzes(quizzes: ModuleQuiz[]): void {
    setStored('mindmate_quizzes', quizzes);
  }

  static getMaterialProgress(studentId: string): MaterialProgress[] {
    return getStored(`mindmate_progress_${studentId}`, []);
  }

  static saveMaterialProgress(studentId: string, progress: MaterialProgress[]): void {
    setStored(`mindmate_progress_${studentId}`, progress);
  }

  static getAnalyticsEvents(): AnalyticsEvent[] {
    return getStored('mindmate_analytics_events', INITIAL_ANALYTICS_EVENTS);
  }

  static addAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    const events = this.getAnalyticsEvents();
    const newEvent: AnalyticsEvent = {
      ...event,
      id: 'e_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    events.push(newEvent);
    setStored('mindmate_analytics_events', events);
    
    // Update performance aggregates if this is a quiz attempt
    if (event.eventType === 'quiz_attempt' && event.topicId) {
      this.updateTopicPerformance(event.topicId, event.value?.score, event.value?.passed);
    }
  }

  static getTopicPerformances(): TopicPerformanceDetail[] {
    return getStored('mindmate_topic_perf', INITIAL_TOPIC_PERFORMANCES);
  }

  static updateTopicPerformance(topicId: string, score: number, passed: boolean): void {
    const perfs = this.getTopicPerformances();
    const idx = perfs.findIndex(p => p.topicId === topicId);
    if (idx !== -1) {
      const p = perfs[idx];
      const newAttempts = p.attempts + 1;
      const totalScoreSum = (p.avgScore * p.attempts) + score;
      const newAvg = parseFloat((totalScoreSum / newAttempts).toFixed(2));
      const failedCount = Math.round((p.failureRate / 100) * p.attempts) + (passed ? 0 : 1);
      const newFailRate = Math.round((failedCount / newAttempts) * 100);

      const status = newAvg < 2.5 || newFailRate > 50 ? 'Needs Attention' : newAvg < 3.5 || newFailRate > 35 ? 'Below Average' : newAvg < 4.4 || newFailRate > 15 ? 'Fair' : 'Good';

      perfs[idx] = {
        ...p,
        attempts: newAttempts,
        avgScore: newAvg,
        failureRate: newFailRate,
        status
      };
    } else {
      // Create new performance tracker
      perfs.push({
        topicId,
        topicTitle: topicId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        courseTitle: 'Introduction to Machine Learning',
        avgScore: score,
        attempts: 1,
        aiQuestions: 0,
        failureRate: passed ? 0 : 100,
        status: passed ? 'Good' : 'Needs Attention'
      });
    }
    setStored('mindmate_topic_perf', perfs);
  }

  static getTeachingRecommendations(): TeachingRecommendation[] {
    return getStored('mindmate_recommendations', []);
  }

  static saveTeachingRecommendation(rec: TeachingRecommendation): void {
    const recs = this.getTeachingRecommendations();
    const existingIdx = recs.findIndex(r => r.topicId === rec.topicId);
    if (existingIdx !== -1) {
      recs[existingIdx] = rec;
    } else {
      recs.push(rec);
    }
    setStored('mindmate_recommendations', recs);
  }

  static resetDatabase(): void {
    localStorage.removeItem('mindmate_courses');
    localStorage.removeItem('mindmate_modules');
    localStorage.removeItem('mindmate_materials');
    localStorage.removeItem('mindmate_quizzes');
    localStorage.removeItem('mindmate_analytics_events');
    localStorage.removeItem('mindmate_topic_perf');
    localStorage.removeItem('mindmate_recommendations');
    // Clear user sessions progress too
    DEFAULT_USERS.forEach(user => {
      localStorage.removeItem(`mindmate_progress_${user.id}`);
    });
  }
}
