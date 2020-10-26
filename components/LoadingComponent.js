import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function Loading() {
    return (
        <View style={StyleSheet.loadingView}>
            <ActivityIndicator size='large' color='#a296d5' />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        loadingView: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        },
        loadingText: {
            color: '#a296d5',
            fontSize: 14,
            fontWeight: 'bold'
        }
    }
)

export default Loading;