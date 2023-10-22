import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";

// db
import db from './_db.js'

// types
import {typeDefs} from './schema.js'

const resolvers = {
    Query:{
        games(){
            return db.games;
        },
        game(_,args){
            return db.games.find((game)=> game.id=== args.id)
        },
        authors(){
            return db.authors;
        },
        author(_,args){
            return db.authors.find((author)=> author.id=== args.id)
        },
        reviews(){
            return db.reviews;
        },
        review(_,args){
            return db.reviews.find((review)=> review.id=== args.id)
        }
    },
    Game:{
        reviews(parent){
            return db.reviews.filter((review)=> review.game_id===parent.id);
        }
    },
    Author:{
        reviews(parent){
            return db.reviews.filter((review)=> review.author_id === parent.id);
        }
    },
    Review:{
        author(parent){
            return db.authors.find((author)=> author.id === parent.id);
        },
        game(parent){
            return db.games.find((game)=> game.id === parent.id);
        }
    },
    Mutation:
    {
        deleteGame(_,args){
          db.games=db.games.filter((game)=>game.id!==args.id)

          return db.games
        },
        addGame(_,args){
            let game={
                ...args.game,
                id:Math.floor(Math.random()*10000).toString()
            }

            db.games.push(game)

            return game
            
        },
        updateGame(_,args){
            db.games = db.games.map((g)=>{
                if(g.id===args.id){
                    return {
                        ...g,...args.edits
                    }
                }
                return g
            })
            return db.games.find((g)=> g.id===args.id)
        }

    }
}

/* 
query GamesQuery( $gameId: ID! ) {
    game(id: $gameId) {
        title,
        reviews {
            rating,
            content,
        }
    }
}
variables
{
  "id": "2"
}



query ReviewQuery($id:ID! ) {
    author(id:$id){
    name,
        reviews{
            rating,
            content
        }
    }
}

query ReviewQuery($id:ID! ) {
review(id:$id){
  rating,
  game{
    title,
    platform
  }
 }
}


query authorsQuery($authorId: ID!) {

author(id: $authorId) {
  name,
  verified
}
}



mutation DeleteMutation($id:ID!){
  deleteGame(id:$id){
    id,
    title,
    platform
  }
}

*/


// server setup
const server =new ApolloServer({
typeDefs ,
resolvers

})

const {url}= await startStandaloneServer(server,{
    listen:{port:5000}
});

console.log('Server ready at port',5000);





// Apollo explorer link
// https://www.apollographql.com/docs/graphos/explorer/sandbox/