import React, { useEffect , useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Animated,
} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker}from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';

import WifiManager from "react-native-wifi-reborn";


const Map = () => {
  const [curPos, setCurPos] = useState({
    latitude : 0.0,
    longitude : 0.0,
  });
  const [wifilist, setWifiList] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [curPosReal, setCurPosReal] = useState("Test Position");
  const [deterFunc, setDeterFunc] = useState(false);

  const topAnim = useRef(new Animated.Value(0)).current;

  const bottomAnim = useRef(new Animated.Value(2000)).current;

  const bottomUp = () => {
    Animated.timing(bottomAnim, {
      toValue : 0,
      duration : 1000,
      useNativeDriver : false,
    }).start();
  }

  const bottomDown = () => {
    Animated.timing(bottomAnim, {
      toValue : 2000,
      duration : 1000,
      useNativeDriver : false,
    }).start();
  }

  const topDownUp = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(topAnim, {
      toValue : 120,
      duration : 1000,
      useNativeDriver : false,
    }).start();

    setTimeout(() => {
      Animated.timing(topAnim, {
        toValue : 0,
        duration : 1000,
        useNativeDriver : false,
      }).start();
    },4000);

  };

  const requestLocationPermission = async () =>  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Indoor Positioning App',
          'message': 'Indoor Positioning App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
        //alert("You can use the location");
      } else {
        console.log("location permission denied")
        //alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const getCurPosInit = async () => {
    await requestLocationPermission();
    Geolocation.getCurrentPosition((position) => {
      setCurPos(position.coords);
      console.log(position);
    });
    console.log(curPos);
  }

  const getCurPos = async () => {
    await requestLocationPermission();
    Geolocation.getCurrentPosition((position) => {
      setCurPos(position.coords);
      console.log(position);
    });
    console.log(curPos);
    topDownUp();
  }

  const getCurWifiPos = async() => {
    console.log("TEST");
  }

  const requestWifiPermission = async() => {
    try {
      
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission is required for WiFi connections',
          message:
            'This app needs location permission as this is required  ' +
            'to scan for wifi networks.',
          buttonNegative: 'DENY',
          buttonPositive: 'ALLOW',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await WifiManager.loadWifiList().then(
          list => {
            //console.log(list[0]);
            setWifiList(list);
            setIsClicked(true);
            //console.log(list);
          },
          () => {
            console.log("There is no wifi list");
          }
        );
        setDeterFunc(true);
        bottomUp();
      } else {
        console.log("PERMISSION DENIED!")
      }
    } catch (err) {
      console.log(err);
    }
  }

  const requestWifiPermission2 = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission is required for WiFi connections',
          message:
            'This app needs location permission as this is required  ' +
            'to scan for wifi networks.',
          buttonNegative: 'DENY',
          buttonPositive: 'ALLOW',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await WifiManager.reScanAndLoadWifiList().then(
          list => {
            //console.log(list[0]);

            setWifiList(list);
            setIsClicked(true);
            //console.log(list);      
          },
          () => {
            console.log("There is no wifi list");
          }
        );
        bottomUp();
      } else {
        console.log("PERMISSION DENIED!")
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getCurPosReal = async() => {
    try {
      let url = "http://3.35.198.100:3000/rest/user";
      let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
              wifilist
            })
        };
        let response = await fetch(url, options);
        //console.log(response);
        let responseOK = response && response.ok;
        let data = null;
        if (responseOK) {   
          data = await response.json();
        }
        //console.log(data)
        setCurPosReal(data.curPosition);
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCurPosInit();
  }, []);

  useEffect(() => {
    //console.log(wifilist);
    if(wifilist != undefined) {
      getCurPosReal();
    }
  },[wifilist]);

  return (
    <>

    <View style={styles.map}> 
      <MapView 
        style={{ flex: 1 }} 
        region={{ latitude: curPos.latitude, longitude: curPos.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003,}} > 
        <Marker
          coordinate={{latitude: curPos.latitude, longitude: curPos.longitude}}
          title="this is a marker"
          description="this is a marker example"
        />
      </MapView>
    </View>
    <TouchableOpacity onPress={getCurPos} style={styles.roundButton}>
      <Text style={{fontWeight : "bold",}}>Pos</Text>
    </TouchableOpacity>
    <Animated.View style={{marginTop : topAnim,}}>
      <TouchableOpacity style={{
        width : 97 + "%",
        height : 60,
        padding : 10,
        borderRadius : 20,
        backgroundColor: 'white',
        position : 'absolute',
        top : -100,
        shadowColor: "#000000", //그림자색
        shadowOpacity: 0.3,//그림자 투명도
        shadowOffset: { width: 2, height: 2 }, //그림자 위치
        //ANDROID
        elevation: 10,
        flex : 1,
        alignSelf : "center",
        justifyContent: "center",
        alignItems : "center",
      }} onPress={deterFunc ? requestWifiPermission : requestWifiPermission2}>
        <Text style={{fontSize : 15, fontWeight : "bold"}}>내 정확한 실내 위치는 ??</Text>
      </TouchableOpacity>
    </Animated.View>
    
    <Animated.View style={{
      flex : 1,
      justifyContent: "center",
      alignItems : "center",
      marginTop : bottomAnim,
    }}>
      <View style={{
        width : 300,
        height : 400,
        padding : 10,
        borderRadius : 20,
        backgroundColor: 'white',
        shadowColor: "#000000", //그림자색
        shadowOpacity: 0.3,//그림자 투명도
        shadowOffset: { width: 2, height: 2 }, //그림자 위치
        //ANDROID
        elevation: 10,
        alignSelf : "center",
        justifyContent: "center",
        alignItems : "center",
      }}>
        <Text style = {{
          height : 70 + "%",
        }}> Icon </Text>
        <Text> {curPosReal} </Text>
        <TouchableOpacity style={{
          width : 30,
          height: 30,
          position : "absolute",
          top : 15,
          right : 1,
        }} onPress={bottomDown}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>

    </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  roundButton: {
    width: 70,
    height: 70,
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    position : 'absolute',
    bottom : 15,
    left : 15,
    //IOS
    shadowColor: "#000000", //그림자색
    shadowOpacity: 0.3,//그림자 투명도
    shadowOffset: { width: 2, height: 2 }, //그림자 위치
    //ANDROID
    elevation: 10,
    flex : 1,
    justifyContent: "center",
    alignItems : "center",
  },
  topModal : {
    width : 97 + "%",
    height : 60,
    padding : 10,
    borderRadius : 20,
    backgroundColor: 'white',
    position : 'absolute',
    top : 10,
    shadowColor: "#000000", //그림자색
    shadowOpacity: 0.3,//그림자 투명도
    shadowOffset: { width: 2, height: 2 }, //그림자 위치
    //ANDROID
    elevation: 10,
    flex : 1,
    alignSelf : "center",
    justifyContent: "center",
    alignItems : "center",
  }
});

export default Map;