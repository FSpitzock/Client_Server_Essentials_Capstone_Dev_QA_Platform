import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Question from './Question';

// TODO: Define Answer attributes interface
// Hint: Answer should have id, body, questionId, userId, createdAt, updatedAt
interface AnswerAttributes {
  // TODO: Add properties here
   id: number
  body: string
  questionId: number
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

// TODO: Create the Answer class extending Model
class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  // TODO: Declare public properties
  public id!: number
  public body!: string
  public questionId!: number
  public userId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// TODO: Initialize the Answer model
Answer.init(
  {
    // TODO: Define model attributes
    // Remember:
    // - id should be primaryKey and autoIncrement
    // - body should be TEXT type and not null
    // - questionId should reference questions table
    // - userId should reference users table

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 10000]
      }
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'Answer',
    tableName: 'answers'
  }
);

// TODO: Define associations
// Hint: An Answer belongs to a User
// Hint: An Answer belongs to a Question
// Hint: A Question can have many Answers
// Hint: A User can have many Answers

Answer.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
})

Answer.belongsTo(Question, {
  foreignKey: 'questionId'
})

Question.hasMany(Answer, {
  foreignKey: 'questionId',
  as: 'answers'
})

User.hasMany(Answer, {
  foreignKey: 'userId',
  as: 'answers'
})

export default Answer;
