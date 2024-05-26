import React, { useContext, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { AppContext } from '../provider/AppProvider'
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../provider/AuthProvider';

export default function AddRoomModal() {
    const { isAddRoomOpen, setIsAddRoomOpen } = React.useContext(AppContext);
    const [form] = Form.useForm();
    const {
        user: { uid }
    } = useContext(AuthContext);

    const handleOk = () => {
        addDocument('rooms', { ...form.getFieldsValue(), members: [uid] });
        form.resetFields();
        setIsAddRoomOpen(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsAddRoomOpen(false);
    }

    return (
        <div>
            <Modal
                title="Tạo phòng"
                open={isAddRoomOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label="Tên phòng" name='name' rules={[{ required: true }]}>
                        <Input placeholder='Nhập tên phòng'></Input>
                    </Form.Item>
                    <Form.Item label="Mô tả" name='description'>
                        <Input.TextArea placeholder='Nhập mô tả'></Input.TextArea>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
