import { gql } from "apollo-server-express";
import { TableModel } from "../../models";
import { server } from "../apolloServer";

describe('Get tables', () => {
    it('should save new table', async () => {

        await new TableModel({ name: "yeye" }).save()

        const result = await server.executeOperation({
            query: gql`
                query Query {
                    getTables {
                        id
                        name
                        created_date
                    }
                }`
        })

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(result.data?.getTables.length).toBeGreaterThanOrEqual(1)
        expect(result.data?.getTables[0].name).toEqual("yeye")
    });
});