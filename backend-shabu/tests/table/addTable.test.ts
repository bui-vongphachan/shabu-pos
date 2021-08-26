import { gql } from "apollo-server-express";
import { server } from "../../starters/apolloServer";

describe('Add table', () => {
    it('should save new table', async () => {
        const result = await server.executeOperation({
            query: gql`
                mutation AddProductToInvoiceMutation($addTableName: String) {
                    addTable(name: $addTableName) {
                        id
                        name
                        created_date
                    }
                }`,
            variables: { addTableName: "TEST_ONE" }
        })

        expect(result.errors).toBeUndefined()
        expect(result.data).not.toBeUndefined()
        expect(result.data?.addTable).not.toBeUndefined()
        expect(result.data?.addTable.length).toBeGreaterThanOrEqual(1)
        expect(result.data?.addTable[0].name).toEqual("TEST_ONE")
    });

    it('should prevent saving existing name', async () => {
        [1, 1].forEach(async (item, index) => {
            const result = await server.executeOperation({
                query: gql`
                    mutation AddProductToInvoiceMutation($addTableName: String) {
                        addTable(name: $addTableName) {
                            id
                            name
                            created_date
                        }
                    }`,
                variables: { addTableName: "SAVING ME" }
            })

            if (index > 0) {
                expect(result.errors).not.toBeUndefined()
                expect(result.errors?.length).toBeGreaterThanOrEqual(1)
            }
        })


    });
});