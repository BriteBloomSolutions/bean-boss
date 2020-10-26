import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';
import { LOCATIONS } from '../shared/locations';

const mapStateToProps = state => {
    return {
        locations: state.locations,
    };
};

class Directory extends Component {

        constructor(props) {
            super(props);
            this.state = { 
                locations:LOCATIONS
             }
        }

    static navigationOptions = {
        title: 'Directory'
    }

    render() {
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({item}) => {
            return (
                <Animatable.View animation='fadeInRightBig' duration={2000}>
                    <Tile   
                    title={item.name}
                    caption={item.description}
                    featured
                    onPress={() => navigate('LocationInfo', { locationId: item.id})}
                    imageSrc={{uri: baseUrl + item.image}}
                />
                </Animatable.View>
            );
        };

       /* if (this.props.locations.isLoading) {
            return <Loading />
        }
        if (this.props.locations.errMess) {
            return (
                <View>
                    <Text>{this.props.locations.errMess}</Text>
                </View>
            );
        }*/
        
        return (
            <FlatList
                data={this.state.locations}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
                />
        );
    }
}

export default connect(mapStateToProps)(Directory);