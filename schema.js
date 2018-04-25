/**
 * http://usejsdoc.org/
 */
// Import the 'axios' module
const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');

/*
// Hard-code some data
const customers = [
	{id:'1', name: 'John Doe', email:'johndoe@gmail.com', age:35},
	{id:'2', name: 'Steve Smith', email:'stevesmith@gmail.com', age:28},
	{id:'3', name:'Sara Williams', email:'sarawilliams@gmail.com', age:32}
];
*/

// Create a customer-type object
const CustomerType = new GraphQLObjectType({
	name:'Customer',
	fields:() => ({
		id: {type:GraphQLString},
		name: {type:GraphQLString},
		email: {type:GraphQLString},
		age: {type:GraphQLInt}
	})
});

// Create a root-query
const RootQuery = new GraphQLObjectType({
	name:'RootQueryType',
	fields:{
		// Return a specific customer
		customer:{
			type:CustomerType,
			args:{
				id:{type:GraphQLString}
			},
			resolve(parentValue, args){
				/*
				for(let i = 0; i < customers.length; i++){
					if (customers[i].id == args.id){
						return customers[i];
					}
				}
				*/
				return axios.get('http://localhost:3000/customers' + args.id)
							.then(res => res.data);
			}
		},
		// Return the entire customer list
		customers:{
			type: new GraphQLList(CustomerType),
			resolve(parentValue, args){
				return customers;
			}
		}
	}
});


// Mutations
const mutation = new GraphQLObjectType({
	name:'Mutations',
	fields:{
		// Create a customer and add them to the data-base
		addCustomer:{
			type:CustomerType,
			args:{
				name:{type: new GraphQLNonNull(GraphQLString)},
				email:{type:new GraphQLNonNull(GraphQLString)},
				age:{type: new GraphQLNonNull(GraphQLString)}
			},
			resolver(parentValue, args){
				axios.post('http://localhost:3000/customers', {
					name:args.name,
					email:args.email,
					age:args.email
				}).then(res => res.data);
			}
		},
		
		// Mutation to delete a customer
		deleteCustomer:{
			type:CustomerType,
			args:{
				id: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolver(parentValue, args){
				axios.delete('http://localhost:3000/customers/'+ args.id)
					 .then(res => res.data);
			}
		},
		
		// Mutation to update a customer
		editCustomer:{
			type:CustomerType,
			args:{
				id:{type: new GraphQLNonNull(GraphQLString)},
				name:{type:GraphQLString},
				email:{type:GraphQLString},
				age:{type:GraphQLString}
			},
			resolver(parentValue, args){
				axios.patch('http://localhost:3000/customers' + args.id, args)
					 .then(res => res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation 
});
