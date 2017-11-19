import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
  } from 'graphql';

import jwt from 'jwt-simple';

import User from '../../models/user';

const AuthenticatedUserType = new GraphQLObjectType({
    name: 'AuthenticatedUser',
    fields: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        success: { type: new GraphQLNonNull(GraphQLBoolean) },
    },
});

export const loginSchema = {
    type: AuthenticatedUserType,
    args: {
      username: {
        name: 'username',
        type: GraphQLString
      },
      password: {
        name: 'password',
        type: GraphQLString
      }
    },
    resolve: async (obj, {username, password}, source, fieldASTs) => {
        let user = await User.findOne({ where: {username: username}});
        if (!user) {
            throw Error('Invalid credentials.');
        } else {
            let isMatch = await user.authenticate(password);
            if (isMatch) {
                let token = jwt.encode({
                    id: user.dataValues.id,
                    username: user.dataValues.username,
                    exp: Date.now() + 30*60*60*24*1000,
                    }, process.env.SECRET);
                return {
                    success: true,
                    token: token,
                    userId: user.dataValues.id,
                    username: user.dataValues.username
                };
            }
            else {
                throw Error('Invalid credentials.');
            }
        }
    }
}

export const registerSchema = {
    type: AuthenticatedUserType,
    args: {
      username: {
        name: 'username',
        type: GraphQLString
      },
      password: {
        name: 'password',
        type: GraphQLString
      }
    },
    resolve: async (obj, {username, password}, source, fieldASTs) => {
        if(username && username.length > 3 && password && password.length > 5){
            let found = await User.findOne({ where: {username: username}});
            if (!found) {
                let user = await User.create({username: username, password: password});
                let token = jwt.encode({
                    id: user.dataValues.id,
                    username: user.dataValues.username,
                    exp: Date.now() + 30*60*60*24*1000,
                    }, process.env.SECRET);
                return {
                    success: true,
                    token: token,
                    userId: user.dataValues.id,
                    username: user.dataValues.username
                };
            }
            else {
                throw Error('Username is already taken.');
            }
        } else {
            throw Error('Invalid credentials.');
        }
    }
}

const VerifyResponseType = new GraphQLObjectType({
    name: 'VerifyResponse',
    fields: {
      success: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

export const verifyTokenSchema = {
    type: VerifyResponseType,
    resolve: async (obj, args, source, fieldASTs) => {
        if (source.userId) {
            return { success: true };
        } else {
            throw Error('Token is invalid.');
        }
    }
}