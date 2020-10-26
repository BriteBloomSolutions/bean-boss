import React, { Component } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import { deleteFavorite } from '../redux/ActionCreators';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
    return {
        locations: state.locations,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    deleteFavorite: locationId => (deleteFavorite(locationId))
};

class Favorites extends Component {

    static navigationOptions = {
        title: 'My Favorites'
    }

    render() {
        const { navigate } = this.props.navigation;
        const renderFavoriteItem = ({item}) => {
            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite location ' + item.name + '?',
                            [
                                { 
                                    text: 'Cancel', 
                                    onPress: () => console.log(item.name + 'Not Deleted'),
                                    style: ' cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                   <Animatable.View animation='fadeInRightBig' duration={2000}>
                        <ListItem
                        title={item.name}
                        subtitle={item.description}
                        leftAvatar={{source: {uri: baseUrl + item.image}}}
                        onPress={() => navigate('LocationInfo', {locationId: item.id})}
                    />
               </Animatable.View>
                </Swipeout>
            
            );
        };

        if (this.props.locations.isLoading) {
            return <Loading />;
        }
        if (this.props.locations.errMess) {
            return (
                <View>
                    <Text>{this.props.locations.errMess}</Text>
                </View>
            );
        }
        return (
            <FlatList
                data={this.props.locations.locations.filter(
                    location => this.props.favorites.includes(location.id)
                )}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
