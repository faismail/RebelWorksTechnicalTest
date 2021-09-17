import React, {Component, useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import { Container, Content, Grid, Col, Card, Icon,} from 'native-base';
import {RFValue, RFPercentage } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient';
import  Modal,{ ModalContent,  ScaleAnimation, ModalFooter, ModalButton, ModalTitle, SlideAnimation } from 'react-native-modals';
import axios from "axios";

const MovieList = ({navigation}) => {

  const [Movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  const [NamaAZ, setNamaAZ] = useState(false);
  const [NamaZA, setNamaZA] = useState(false);
  const [Best, setBest] = useState(false);
  const [newRelease, setNewRelease] = useState(false);


  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  
  const handleChange = (e) => {
    console.log(e)
      setSearchName(e);
    };

  const cekAZ = () => {
    return NamaAZ ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };
  const cekZA = () => {
    return NamaZA ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };
  const cekYoungest = () => {
    return Best ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };
  const cekOldest = () => {
    return newRelease ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };

  const sortAZ = () => {
    Movies.sort((a, b) => (a.title > b.title) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(true), setNamaZA(false), setBest(false), setNewRelease(false)
  };
  const sortZA = () => {
    Movies.sort((a, b) => (b.title > a.title) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(false), setNamaZA(true), setBest(false), setNewRelease(false)
  };
  const sortRating = () => {
    Movies.sort((a, b) => (a.vote_average < b.vote_average) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(false), setNamaZA(false), setBest(true), setNewRelease(false)
  };
  const sortRelease = () => {
    Movies.sort((a, b) => (b.release_date > a.release_date) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(false), setNamaZA(false), setBest(false), setNewRelease(true)
  };

  const getMoviesList = async () => {
    setIsLoading(true);
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=ba48e11acaf2c805f4bf80692b9716cb&page=${pageCurrent}`)
    .then(res => {
      setMovies([...Movies,...res.data.results]);
      setIsLoading(false)
    })
    .catch(function(error) {
      navigation.replace('StartedPage')
  });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity key={item.id} onPress={() => navigation.navigate('MovieDetail', {id: item.id,})}>
        <LinearGradient useAngle={true}
                      angle={200}
                      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.3)']}
                      locations={[0,1]}
                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                      style={styles.CardList}>  
            <Col style={{  flexDirection:'row',}}>

                <Col style={{width:'35%', alignSelf:'center', }}>  
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/original/${item.poster_path}` }}
                      style={{width: RFPercentage(12), height: RFPercentage(17), alignSelf:'center', borderRadius:10, }}
                    />
                </Col>

                <Col style={{ width:'65%', height:'100%', alignSelf:'center', justifyContent:'space-around', flexDirection:'column'}}>

                    <Col style={{ width:'100%',}}>
                      <Text style={styles.ListText}>{item.title} </Text>
                    </Col>

                    <Col style={{width:'100%',  flexDirection:'row', alignItems:'center', justifyContent:'space-between'  }}>

                      <View >
                        <Text style={styles.DateText}>{convertDate (item.release_date)}</Text>
                      </View>

                      <LinearGradient useAngle={true}
                        angle={200}
                        colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)']}
                        locations={[0,1]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        style={styles.ViewInfo}>  

                        <Icon type="FontAwesome" name="star" style={{ fontSize:RFValue(16, 680),  color:'orange' }}/> 
                        <Text style={styles.InfoText}> {item.vote_average} </Text>

                      </LinearGradient>
                    </Col>
                </Col>
            </Col>
        </LinearGradient>
      </TouchableOpacity>
    )
  };

  const renderLoader = () => {
    return (
      isLoading ?
      <View style={{ alignSelf:'center', marginTop:'10%', }}>
          <ActivityIndicator size="large" color="white" />
      </View> : null
    )
  }

  const handleLoadMore = () => {
    setPageCurrent(pageCurrent + 1)
  }

  const convertDate = (waktu) => {
      let date = new Date(waktu).getDate() < 10 ? '0' + new Date(waktu).getDate() : new Date(waktu).getDate()
      let months = new Date(waktu).getMonth()
      let year = new Date(waktu).getFullYear()

      return `${date} ${monthNames[months]} ${year}`
  
  };

  useEffect(() => {
    setIsLoading(true);
    getMoviesList();

  },[pageCurrent]);

    return (
      <SafeAreaView style={styles.container}>
            <Col style={{ marginVertical:'5%', alignItems:'center'}}>
                <View style={styles.SearchBar}>
                  <Icon type="FontAwesome" name="search" style={{justifyContent:'center', marginHorizontal:'2%',  fontSize:RFValue(25, 680),  color:'black' }}/>
                    <TextInput
                        style={{ width:'60%',  }}
                        placeholder="Search Movies"
                        placeholderTextColor="grey"
                        fontFamily="Avenir Next"
                        fontSize={16}
                        fontWeight={'500'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onChangeText={handleChange}
                    />
                    <TouchableOpacity style={{ width:'20%', flexDirection:'row',  }} 
                                      onPress={() => setModalVisible (true) }>
                          <Text style={styles.SortingText}> 
                            SORT
                          </Text>
                          <Icon type="FontAwesome" name="caret-down" style={{ marginHorizontal:'5%',  fontSize:RFValue(18, 680),  color:'orange' }}/>
                    </TouchableOpacity>
                </View>

                <FlatList style={styles.CardList}
                          data={Movies}
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={item => `${item.id}`}
                          renderItem={renderItem}
                          ListFooterComponent={renderLoader}
                          onEndReached={ handleLoadMore }
                          onEndReachedThreshold={0}
                          >
                </FlatList>
            </Col>

            <Modal visible={ modalVisible }
                      onTouchOutside={() => setModalVisible (false) } 
                      swipeDirection={['up', 'down']} 
                      swipeThreshold={200} 
                      onSwipeOut={() => setModalVisible (false) }
                      modalAnimation={new SlideAnimation({slideFrom: 'bottom', initialValue: 0, useNativeDriver: (true) })}
                      >
                <ModalContent style={{ backgroundColor: 'white' }} >

                    <Col style={{width:RFPercentage(35), height:RFPercentage(30), justifyContent:'center'}}>
                      <TouchableOpacity style={styles.mainContainer} onPress={ (sortAZ)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekAZ()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>A - Z</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.mainContainer} onPress={ (sortZA)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekZA()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>Z - A</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.mainContainer} onPress={ (sortRating)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekYoungest()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>Top Rating</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.mainContainer} onPress={ (sortRelease)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekOldest()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>Newest Release</Text>
                        </View>
                      </TouchableOpacity>
                    </Col>       
                </ModalContent>
              </Modal>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black',
    alignItems:'center',
    justifyContent:'center',
    },

  CardList: {
    width: RFPercentage(48),
    height:RFPercentage(20),
    paddingHorizontal:'5%',
    borderRadius:25, 
    borderWidth:1,
    borderColor:'rgba(255, 255, 255, 0.07)',
    alignSelf:'center',
    marginVertical:'3%',
  },

  SearchBar: {
    width: '100%',
    height:RFPercentage(5.5),
    marginLeft:'2%',
    alignSelf:'center',
    alignItems:'center',
    textAlign:'center',
    justifyContent:'center', 
    borderRadius: 8,
    backgroundColor: "white",
    flexDirection: "row",
  },

  ListText:{
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    fontSize: RFValue(17, 680),
    color:'white',
    justifyContent:'center',
  },

  DateText:{
    fontFamily: 'Avenir Next',
    fontSize: RFValue(14, 680),
    color:'white',
    justifyContent:'center',
  },

  ViewInfo: {
    width:RFPercentage(7), 
    height:RFPercentage(3.5), 
    borderRadius:10, 
    borderWidth:1, 
    borderColor:'grey', 
    flexDirection:'row', 
    alignItems:'center',
    alignSelf:'flex-end',
    justifyContent:'center',
  },

  InfoText:{
    fontFamily: 'Avenir Next',
    fontWeight: '500',
    fontSize: RFValue(14, 680),
    color:'white',
    justifyContent:'center'
  },
  mainContainer: {
    height: RFPercentage(6),
    width: '100%',
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginVertical:'3%',
  },
  radioButtonIcon: {
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: '#fd6542',
    height: RFPercentage(4),
    width: RFPercentage(4),
    borderRadius: 20,
    marginRight: '5%',
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
    backgroundColor:'#fd6542',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
  },

});

export default MovieList;


