import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Alert from 'react-bootstrap/esm/Alert';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';


class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            hikeIn: false,
            date: '',        };
    }

    static navigationOptions = {
        title: 'Reserve a Room'
    }


    handleReservation() {
        console.log(JSON.stringify(this.state));
        const message = `Number of Guests: ${this.state.guests}
        '\nDate: ${this.state.date}`;
        Alert.alert(
        'Begin Search?',
        message,
        [
            {
                text: 'Cancel',
                onPress: () => {
                    console.log('Reservation Search Canceled');
                     this.resetForm();
        },
         style: 'cancel'
    },
    {
        text: 'OK', 
        onPress: () => {
            this.presentLocalNotification(this.state.date);
            this.resetForm();
},
}
        ],
        {cancelable: false }
    );
}
    

    resetForm() {
        this.setState({
            guests: 1,
            date: '',
        });
    }

    async obtainNotificationPermission() {
        const permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            const permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
            return permission;
        }
        return permission;
    }

    async presentLocalNotification(date) {
        const permission = await this.obtainNotificationPermission();
        if (permission.status === 'granted') {
            Notifications.presentLocalNotificationAsync({
                title: 'Your Reservation Search',
                body: 'Search for ' + date + ' requested'
            });
        }
    }


    render() {
        return (
            <Animatable.View
            animation="ZoomIn"
            duration= '2'
            delay= '1'
            >
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={itemValue => this.setState({guests: itemValue})}>
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' vlaue='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format='YYYY-MM-DD'
                        mode='date'
                        placeholder='Select Date'
                        minDate={new Date().toISOString()}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                            }
                        }}
                        onDateChange={date => {this.setState({date: date})}}
                        />
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation()}
                        title='Search'
                        color='#a296d5'
                        accessabilityLabel='Tap here to search for available rooms to reserve'
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.resetForm()}
                        title='Cancel'
                        color='#a296d5'
                        accessabilityLabel='Tap here to cancel'
                    />
                    <Button
                        onPress={() => this.onSubmit()}
                        title='Ok'
                        color='#a296d5'
                        accessabilityLabel='Tap here to submit reservation'
                    />
                </View>

               
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#a296d5',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;