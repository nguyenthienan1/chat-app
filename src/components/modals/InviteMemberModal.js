import React, { useContext, useState } from 'react'
import { Form, Input, Modal, Select, Spin, Avatar } from 'antd'
import { AppContext } from '../provider/AppProvider'
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../provider/AuthProvider';
import { doc, onSnapshot, collection, query, orderBy, where, limit, getDocs, updateDoc } from "firebase/firestore";
import { get, update } from 'firebase/database';
import { db } from '../../firebase/config';
import { debounce } from 'lodash';

function DebounceSelect({ fetchOptions, debounceTimeout = 300, curMembers, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    React.useEffect(() => {
        return () => {
            // clear when unmount
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    try {
        const q = query(
            collection(db, 'users'),
            where('keywords', 'array-contains', search?.toLowerCase()),
            orderBy('displayName'),
            limit(20)
        );
        const snapshot = await getDocs(q);
        const userList = snapshot.docs.map(doc => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
        })).filter(opt => !curMembers.includes(opt.value));
        return userList;
    } catch (error) {
        console.error('Error fetching user list:', error);
        throw error;
    }
}


export default function InviteMemberModal() {
    const { isInviteMemberOpen, setIsInviteMemberOpen, selectedRoomId, selectedRoom, } = React.useContext(AppContext);
    const [value, setValue] = useState([]);
    const [form] = Form.useForm();

    const handleOk = () => {
        form.resetFields();
        setValue([]);

        // update members in current room
        const roomRef = doc(db, 'rooms', selectedRoomId);

        try {
            updateDoc(roomRef, {
                members: [...selectedRoom.members, ...value.map((val) => val.value)],
            });
        } catch (error) {
            console.error('Error updating members:', error);
        }
        setIsInviteMemberOpen(false);
    };

    const handleCancel = () => {
        // reset form value
        form.resetFields();
        setValue([]);

        setIsInviteMemberOpen(false);
    };


    return (
        <div>
            <Modal
                title='Mời thêm thành viên'
                open={isInviteMemberOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        name='search-user'
                        label='Tên các thành viên'
                        value={value}
                        placeholder='Nhập tên thành viên'
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    );
}
