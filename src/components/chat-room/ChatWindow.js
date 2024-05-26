import { UserAddOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, Button, Form, Input, Alert } from 'antd';
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Message from './Message';
import { AppContext } from '../provider/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../provider/AuthProvider';
import useFilestore from '../../hooks/useFilestore';

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 90vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberOpen } = useContext(AppContext);
  const [inputValue, setInputValue] = useState('');
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleOnSubmit = (e) => {
    addDocument('messages', {
      text: inputValue,
      uid: uid,
      photoURL: photoURL,
      roomId: selectedRoom.id,
      displayName: displayName
    });
    form.resetFields(['message']);
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFilestore('messages', condition);

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className='header__info'>
              <p className='header__title'>{selectedRoom.name}</p>
              <span className='header__description'>{selectedRoom.description}</span>
            </div>
            <div>
              <ButtonGroupStyled>
                <Button icon={<UserAddOutlined />} onClick={() => setIsInviteMemberOpen(true)}>Mời</Button>
                <Avatar.Group size='small' maxCount={2}>
                  {
                    members.map(member => <Tooltip title={member.displayName} key={member.id}>
                      <Avatar src={member.photoURL}>{member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                    </Tooltip>)
                  }
                </Avatar.Group>
              </ButtonGroupStyled>

            </div>
          </HeaderStyled>

          <ContentStyled>
            <MessageListStyled>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  text={msg.text}
                  photoURL={msg.photoURL}
                  displayName={msg.displayName == displayName ? 'You' : msg.displayName}
                  createdAt={msg.createdAt}
                />
              ))}
              <FormStyled form={form}>
                <Form.Item name="message">
                  <Input
                    onChange={handleInputChange}
                    onPressEnter={handleOnSubmit}
                    placeholder='Tin nhắn'
                    autoComplete='off'
                  />
                </Form.Item>
                <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
              </FormStyled>
            </MessageListStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message='Vui lòng chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  )
}
