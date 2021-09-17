import React, {Component, useEffect, useState, useCallback} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, ImageBackground, SafeAreaView, ScrollView, } from 'react-native';
import { Container, Content, Grid, Col, Card, Icon, Input} from 'native-base';
import {RFValue, RFPercentage } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import { CommonActions } from '@react-navigation/native';
import axios from "axios";

const MovieDetail = ({route, navigation}) => {

  const [moviedetail, setMovieDetails] = useState([]);
  const [genre, setGenre] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [textShown, setTextShown] = useState(false); 
  const [lengthMore,setLengthMore] = useState(false); 
  const [ numOfLines, setNumOfLines ] = useState(0);
    
  const getMovieDetails = () => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/movie/${route.params.id}?api_key=ba48e11acaf2c805f4bf80692b9716cb`,
      headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
      }
    })
    .then(res => {
      setMovieDetails(res.data);
      setGenre(res.data.genres);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const getMovieSimilar = () => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/movie/${route.params.id}/similar?api_key=ba48e11acaf2c805f4bf80692b9716cb`,
      headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
      }
    })
    .then(res => {
      setSimilar(res.data.results);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const onTextLayout = useCallback(e => {
    if(numOfLines == 0)
        setNumOfLines(e.nativeEvent.lines.length);
  });

  const onLoadMoreToggle = () => {
    setLengthMore(!lengthMore);
  };

  useEffect(() => {
    getMovieDetails();
    getMovieSimilar();

  },[]);
  
  return moviedetail.id ? (
    <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
      <Col style={styles.BoxBackDrop} >
            <ImageBackground  
                source={{ uri: `https://image.tmdb.org/t/p/original/${moviedetail.backdrop_path}` }}
                style={{width: RFPercentage(55),height: RFPercentage(55), alignSelf:'center', resizeMode: 'cover', justifyContent:'flex-end'}}
            >
                <Col style={{width:'100%', flexDirection:'row',justifyContent:'space-around', paddingHorizontal:'3%', marginBottom:'2%'  }}>
                <LinearGradient useAngle={true}
                              angle={200}
                              colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)']}
                              locations={[0,1]}
                              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                              style={styles.ViewInfo}>  
                              <Text style={styles.InfoText}> {moviedetail.runtime}min </Text>
                </LinearGradient>
                {
                  genre.slice(0,2).map((value) => (
                    <LinearGradient useAngle={true}
                              angle={200}
                              colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)']}
                              locations={[0,1]}
                              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                              style={styles.ViewInfo}
                              key={value.id} >  
                              <Text style={styles.InfoText}> {value.name}</Text>
                  </LinearGradient>
                  )
                )}
                <LinearGradient useAngle={true}
                                angle={200}
                                colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)']}
                                locations={[0,1]}
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                style={styles.ViewInfo}>  

                                <Icon type="FontAwesome" name="star" style={{ fontSize:RFValue(16, 680),  color:'orange' }}/> 
                                <Text style={styles.InfoText}> {moviedetail.vote_average} </Text>
                  </LinearGradient>

              </Col>
            </ImageBackground> 
      </Col>

      <Col style={styles.BoxInfo}>
            <Text style={styles.ListText}>
              {moviedetail.title}
            </Text>

            <Text onTextLayout={onTextLayout}
                  numberOfLines={numOfLines == 0 ? null : lengthMore ? numOfLines : 3} 
                  style={styles.OverviewText}
                  >
              {moviedetail.overview}
            </Text>

            {
                (numOfLines > 3) &&
                <TouchableOpacity onPress={onLoadMoreToggle}>
                    <Text style={styles.ReadMoreText}>{ lengthMore ? 'Read Less' :'Read More'}</Text>
                </TouchableOpacity>
            }
      </Col>

      <Col style={styles.BoxSimilar}>

          <Text style={styles.ListText}>
            Recommended
          </Text>
          <Animated.ScrollView style={{width:'95%', height:'35%', marginTop:'3%'  }}
                               horizontal={true}
                               showsHorizontalScrollIndicator={false}
                                 >
                {
                  similar.map((value) => (
                    <TouchableOpacity   onPress={() => navigation.replace('MovieDetail', {id: value.id,})}
                                        style={{ alignItems:'center', }} >
                      <Image  key={value.id}
                                        source={{ uri: `https://image.tmdb.org/t/p/original/${value.poster_path}` }}
                                        style={{width: RFPercentage(15),height: RFPercentage(20),alignItems:'center', alignSelf:'center',resizeMode: 'cover', marginHorizontal:'0.5%' }}
                      />
                      <Text style={styles.SimilarText}> {value.title}</Text>
                    </TouchableOpacity>
                   
                  )
                )}
          </Animated.ScrollView>

      </Col>          
    </ScrollView>
    
) : (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color="white"  />
    </View>
  );
};

const styles = StyleSheet.create({

container: {
  flex: 1,
  backgroundColor: 'black',
  },

BoxBackDrop: {
  flex:1,
  width: '100%',
  height: '50%',
  alignItems:'center',
},

BoxInfo: {
  flex:1,
  width: '100%',
  height: '20%',
  marginTop:'2%'
},

BoxSimilar: {
  flex:1,
  width: '100%',
  height: '30%',
},

ListText:{
  fontFamily: 'Avenir Next',
  fontWeight: '700',
  fontSize: RFValue(20, 680),
  color:'white',
  paddingHorizontal:'3%',
},

OverviewText:{
  flex:1,
  fontFamily: 'Avenir Next',
  fontSize: RFValue(16, 680),
  color:'white',
  paddingHorizontal:'3%',
  marginTop:'2%',
},

InfoText:{
  fontFamily: 'Avenir Next',
  fontWeight: '500',
  fontSize: RFValue(14, 680),
  color:'white',
  justifyContent:'center'
},

SimilarText:{
  fontFamily: 'Avenir Next',
  fontWeight: '500',
  fontSize: RFValue(14, 680),
  color:'white',
},

ReadMoreText:{
  fontFamily: 'Avenir Next',
  fontWeight: '700',
  fontSize: RFValue(14, 680),
  color:'white',
  marginTop:'1%',
  marginLeft:'3%',
},

ViewInfo: {
  width:RFPercentage(9), 
  height:RFPercentage(3.5), 
  borderRadius:10, 
  borderWidth:1, 
  borderColor:'grey', 
  flexDirection:'row', 
  alignItems:'center',
  justifyContent:'center',
},

indicator: {
  flex: 1,
  backgroundColor: 'black',
  alignItems: 'center',
  justifyContent: 'center',
},

});

export default MovieDetail;