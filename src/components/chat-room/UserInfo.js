import React from 'react'
import { Row, Col, Button, Typography, Avatar } from "antd";
import styled from 'styled-components';
import { auth, db } from '../../firebase/config';

import { AuthContext } from '../provider/AuthProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

export default function UserInfo() {
    const { user: {
        displayName,
        photoURL,
    } } = React.useContext(AuthContext);

    return (
        <WrapperStyled>
            <div>
                <Avatar src={photoURL}>
                    {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography.Text className='username'>{displayName}</Typography.Text>
            </div>
            <div>
                <Button ghost onClick={() => auth.signOut()}>Đăng xuất</Button>
            </div>
        </WrapperStyled>
    )
}
