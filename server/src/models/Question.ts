import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

// TODO: Define Question attributes interface
// Hint: Question should have id, title, body, userId, createdAt, updatedAt
interface QuestionAttributes {
  // TODO: Add properties here
  id: number
  title: string
  body: string
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

// TODO: Create the Question class extending Model
class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  // TODO: Declare public properties
  public id!: number
  public title!: string
  public body!: string
  public userId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// TODO: Initialize the Question model
Question.init(
  {
    // TODO: Define model attributes
    // Remember:
    // - id should be primaryKey and autoIncrement
    // - title should be not null with minimum length
    // - body should be TEXT type and not null
    // - userId should reference the users table
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [10, 255]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [20, 10000]
      }
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
    modelName: 'Question',
    tableName: 'questions'
  }
);

// TODO: Define associations
// Hint: A Question belongs to a User
// Hint: A User can have many Questions

Question.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
})

User.hasMany(Question, {
  foreignKey: 'userId',
  as: 'questions'
})
export default Question;
