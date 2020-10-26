import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList,
    Modal, Button, StyleSheet,
    Alert, PanResponder, Share } from 'react-native';
import {Rating, Input, Card, Icon} from 'react-native-elements'
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
import { LOCATIONS } from '../shared/locations';
import { COMMENTS } from '../shared/comments';


const mapStateToProps = state => {
    return {
        locations: state.locations,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: locationId => (postFavorite(locationId))
};

function RenderLocation(props) {

    const {location} = props;

    const view = React.createRef();

    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;
    const recognizeComment = ({dx}) => (dx > 200) ? true : false;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + location.name + ' to favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                );
            }

            else if (recognizeComment(gestureState)) {
                this.toggleModal();
            }          
        }
    });

    const shareLocation = (title, message, url) => {
        Share.share({
            title: title,
            message: `${title}: ${message} ${url}`,
            url: url
        },{
            dialogTitle: 'Share ' + title
        });
    };


    if (location) {
        return (
            <Animatable.View
                animation='fadeInDown'
                duration={2000}
                delay={1000}
                ref={view}
                {...panResponder.panHandlers}> 
                <Card
                featuredTitle={location.name}
                image={{uri: baseUrl + location.image}}>
                <Text style={{margin: 10}}>
                    {location.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ? 
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />
                    <Icon 
                        style={styles.cardItem}
                        name={props.pencil ? 'pencil' : 'pencil' }
                        type='font-awesome'
                        color='#a296d5'
                        raised
                        reverse
                        onPress={() => props.onShowModal()}
                    />
                    <Icon
                            name={'share'}
                            type='font-awesome'
                            color='#a296d5'
                            style={styles.cardItem}
                            raised
                            reverse
                            onPress={() => shareLocation(location.name, location.description, baseUrl + location.image)} 
                        />
                </View>
            </Card>
            </Animatable.View>
        
        );
    }
    return <View />
}

function RenderComments({comments}) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating 
                startingValue={item.rating}
                imageSize={10}
                style={{alignItems: 'flex-start',
                    paddingVertical: '5%'}}
                readonly='true'
                />                 
<Text style={{ fontSize: 12 }}>{`--${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
         </Card>
        </Animatable.View>
    );
}

class LocationInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            rating: 5,
            author: '',
            text: '',
            locations: LOCATIONS,
            comments: COMMENTS

        }
    }
    
    markFavorite = (locationId) => {
        this.props.postFavorite(locationId);
    }

    static navigationOptions = {
        title: 'Location Information'
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment = (locationId) => {
        console.log(JSON.stringify(this.state));
        const newComment = {

            locationId: locationId,
            rating: this.state.rating,
            author: this.state.author,
            text: this.state.text,
            date: new Date().toISOString(),
            id: this.state.comments.length
        }
        let copiedComments = [...this.state.comments, newComment];
        this.setState({comments: copiedComments});
        this.toggleModal();
    }

    resetForm = () => {
        this.setState(
            {  showModal: false,
                rating: 5,
                author: '',
                text: ''}
        );
    }


    

    render() {
        const locationId = this.props.navigation.getParam('locationId');
        const location = this.state.locations.filter(location => location.id === locationId)[0];
        const comments = this.state.comments.filter(comment => comment.locationId === locationId);
        return ( 
            <ScrollView>
                <RenderLocation location={location}
                favorite={this.props.favorites.includes(locationId)}
                markFavorite={() => this.markFavorite(locationId)}
                onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments}/>

                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                        <View style={styles.modal}>
                           <Rating
                            showRating={true}
                            startingValue={this.state.rating}
                            imagesize={40}
                            onFinishRating={(rating)=>this.setState({rating: rating})} 
                            style={{paddingVertical: 10}}
                            />
                           <Input
                              placeholder='Author'
                              leftIcon={{type: 'font-awesome', name:'user-o'}}
                              leftIconContainerStyle={{paddingRight:10}}
                              onChangeText={(text) => this.setState({author: text})}
                              value={this.state.author}
                           />
                           <Input
                              placeholder='Comment'
                              leftIcon={{type: 'font-awesome', name:'comment-o'}}
                              leftIconContainerStyle={{paddingRight:10}}
                              onChangeText={(text) => this.setState({text})}
                              value={this.state.text}
                           />
                           <View>
                           <Button
                                    onPress={() => {
                                        this.handleComment(locationId);
                                        this.resetForm();
                                    }}
                                    color='#a296d5'
                                    title='Submit'
                                />
                                </View>
                            <View
                            style={{margin: 10}}>
                                <Button
                                    onPress={() => {
                                        this.toggleModal();
                                    }}
                                    color='#808080'
                                    title='Cancel'
                                />
                            </View>
                        </View>
                    </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(LocationInfo);