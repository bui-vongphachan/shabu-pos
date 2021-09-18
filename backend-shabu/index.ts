import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from "express"
import { connectToMongoDB } from './starters/mongo';
import { server, schema } from './starters/apolloServer';
import { printBillRoute } from './routes/printBill.route';
import cors from "cors"
import 'dotenv/config'

(async function () {
    const app = express();

    app.use(cors())
    app.use(printBillRoute)

    const httpServer = createServer(app);


    await server.start();
    server.applyMiddleware({ app });

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    const PORT = 4000;
    httpServer.listen(PORT, async () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
        await connectToMongoDB()
    }
    );
})();



