import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Answer from './Answer';

// TODO: Define Vote attributes interface
// Hint: Vote should have id, value, answerId, userId, createdAt
interface VoteAttributes {
  // TODO: Add properties here
    id: number;
  value: number; // 1 = upvote, -1 = downvote
  answerId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VoteCreationAttributes extends Optional<VoteAttributes, 'id'> {}

// TODO: Create the Vote class extending Model
class Vote extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
  // TODO: Declare public properties
  public id!: number;
  public value!: number;
  public answerId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// TODO: Initialize the Vote model
Vote.init(
  {
    // TODO: Define model attributes
    // Remember:
    // - id should be primaryKey and autoIncrement
    // - value should be INTEGER (1 for upvote, -1 for downvote)
    // - answerId should reference answers table
    // - userId should reference users table
    // - Add validation to ensure value is only 1 or -1
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, -1]]
      }
    },
    answerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'answers',
        key: 'id'
      }
    },
     userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Vote',
    tableName: 'votes',
    indexes: [
      // TODO: Add unique index for userId + answerId
      // This prevents a user from voting multiple times on same answer
       {
         unique: true,
         fields: ['userId', 'answerId']
       }
    ]
  }
);

// TODO: Define associations
// Hint: A Vote belongs to a User
// Hint: A Vote belongs to an Answer
// Hint: An Answer can have many Votes
Vote.belongsTo(User, { foreignKey: 'userId' });
Vote.belongsTo(Answer, { foreignKey: 'answerId' });

User.hasMany(Vote, { foreignKey: 'userId' });
Answer.hasMany(Vote, { foreignKey: 'answerId' });
export default Vote;
