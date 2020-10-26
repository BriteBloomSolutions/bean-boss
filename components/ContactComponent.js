import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import { LOCATIONS } from "../shared/locations";
import { PARTNERS } from "../shared/partners";
import { PROMOTIONS } from "../shared/promotions";
import * as Animatable from "react-native-animatable";
import * as MailComposer from 'expo-mail-composer';


class Contact extends Component {
  static navigationOptions = {
    title: "Contact Us",
  };

  sendMail() {
    MailComposer.composeAsync({
        recipients: ['admin@hipjoe.com'],
        subject: 'Inquiry',
        body: 'To whom it may concern:'
    })
}

  render() {
    return (
      <ScrollView>
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <Card title="Contact Us" wrapperStyle={{ margin: 20 }}>
            <Text>1 Peachtree Way</Text>
            <Text>Atlanta, GA 30318</Text>
            <Text style={{ marginBottom: 10 }}>USA</Text>
            <Text>Phone: 1-404-770-0678</Text>
            <Text>Email: admin@hipjoe.com</Text>
            <Button
                            title="Send Email"
                            buttonStyle={{backgroundColor: '#a296d5', margin: 40}}
                            icon={<Icon
                                name='envelope-o'
                                type='font-awesome'
                                color='#fff'
                                iconStyle={{marginRight: 10}}
                            />}
                            onPress={() => this.sendMail()}
                        />
          </Card>
        </Animatable.View>
      </ScrollView>
    );
  }
}

export default Contact;
