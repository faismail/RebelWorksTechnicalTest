import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, TextInput, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Card, CardItem, Container, Text, Form, View, Textarea, Picker, Col, Icon, Button} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {RebelWorks} from '../../Assets/Images/index';

const StartedPage = ({ navigation }) => {

  return (
    <Container style={styles.container}>
        <Col style={{  justifyContent:'center', alignSelf:'center',  }}>  
                <TouchableOpacity onPress={()=>navigation.navigate('MovieList')}>
                    <Image style={styles.logoStyle} source={RebelWorks} />
                    <Text style={styles.buttonText}>
                        Getting Started
                    </Text>
                </TouchableOpacity>     
        </Col>
    </Container>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },

    logoStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: RFPercentage(35),
        height: RFPercentage(35),
        },

    buttonText: {
        fontFamily: 'Avenir Next',
        fontSize: RFValue(25, 680),
        color: 'black',
        textAlign: 'center',
        marginTop:'10%'
    },
});


export default StartedPage;