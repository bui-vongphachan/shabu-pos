import { Button, Card, Form, Input, Space } from "antd"
import { Fragment, useContext } from "react"
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from "@apollo/client";
import { AddProductMutationString } from "../../lib/graphql/product/addProduct.gql";
import { MenuPageContext } from ".";

const AddProductMenuComponent = () => {

    const menuPageContext = useContext(MenuPageContext);

    const [addProduct, addProductResponse] = useMutation(AddProductMutationString)

    const submitForm = async (formValue: {
        name: string,
        category: string,
        sizes: [{
            name: string,
            price: number
        }]
    }) => {
        try {
            const { data } = await addProduct({
                variables: {
                    addProductName: formValue.name,
                    addProductCategory: formValue.category,
                    addProductSizes: formValue.sizes.map(size => {
                        return {
                            name: size.name,
                            price: parseFloat(`${size.price}`)
                        }
                    })
                }
            })

            menuPageContext.setProducts(data.addProduct)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Card className=" rounded-md" title="ເພີ່ມລາຍການອາຫານ">
                <Form layout="vertical" requiredMark onFinish={submitForm}>
                    <Form.Item label="ຊື່ອາຫານ" name="name" key="name" rules={[{ required: true, message: 'ກະລຸນາປ້ອນຂໍ້ມູນ' }]}>
                        <Input disabled={addProductResponse.loading} />
                    </Form.Item>
                    <Form.Item label="ປະເພດ" name="category" key="category" rules={[{ required: true, message: 'ກະລຸນາປ້ອນຂໍ້ມູນ' }]}>
                        <Input disabled={addProductResponse.loading} />
                    </Form.Item>
                    <Form.List name="sizes">
                        {(fields, { add, remove }) => (
                            <Fragment>
                                {
                                    fields.map((field) =>
                                        <div>
                                            <Space key={field.key} align="baseline">
                                                <Form.Item
                                                    {...field}
                                                    label="ຂະໜາດ"
                                                    name={[field.name, 'name']}
                                                    fieldKey={[field.fieldKey, 'name']}
                                                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຂໍ້ມູນ' }]}
                                                >
                                                    <Input type="text" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="ລາຄາ"
                                                    name={[field.name, 'price']}
                                                    fieldKey={[field.fieldKey, 'price']}
                                                    rules={[{ required: true, message: 'ກະລຸນາປ້ອນຂໍ້ມູນ' }]}
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                                <div className=" relative">
                                                    <MinusCircleOutlined className=" top-6 absolute" onClick={() => {
                                                        console.log(field)
                                                        remove(field.name)
                                                    }} />
                                                </div>

                                            </Space>
                                        </div>)
                                }
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        ເພີ່ມຂະໜາດອາຫານ
                                    </Button>
                                </Form.Item>
                            </Fragment>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button htmlType="submit" >ເພີ່ມ</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default AddProductMenuComponent