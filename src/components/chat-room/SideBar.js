import React from 'react'
import { Row, Col, Button, Typography } from "antd";
import UserInfo from './UserInfo';
import RoomList from './RoomList';
import styled from 'styled-components';

const SidebarStyled = styled.div`
  background: #3f0e40;
  color: white;
  height: 100vh;
`;

export default function SideBar() {
    return (
        <SidebarStyled>
            <Row>
                <Col span={24}><UserInfo /></Col>
                <Col span={24}><RoomList /></Col>
            </Row>
        </SidebarStyled>
    )
}
