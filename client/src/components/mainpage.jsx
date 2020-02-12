import React, { Component } from "react";
import { Route } from "react-router";
import { observer, inject } from "mobx-react";
import { Row, Col, Container, Card, CardBody } from "shards-react";

@observer
class Mainpage extends Component {
  render() {
    return (
      <Container className="content-container" id="content" fluid>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody style={{ textAlign: "center" }}>
                <h3>Как это работает?</h3>
                <iframe
                  title="how-it-works"
                  width="800"
                  height="550"
                  src="https://www.youtube.com/embed/k9PyrwEmtao"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Mainpage;
