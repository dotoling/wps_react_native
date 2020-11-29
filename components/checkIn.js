import React, { useEffect , useState, } from 'react';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CheckIn = () => {
  const [CheckInData, setCheckInData] = useState([]);

  const getCheckInData = async() => {
    let url = "http://3.35.198.100:3000/rest/user/history";
    let options = {
          method: 'GET',
          mode: 'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
          },
      };
      let response = await fetch(url, options);
      let responseOK = response && response.ok;
      let data = null;
      if (responseOK) {   
        data = await response.json();
      }
      console.log(data);
      setCheckInData(data.history);
      console.log(CheckInData);
  }
  
  useEffect(() => {
    getCheckInData();
  }, []);

  return (
    <>
      <ScrollView style = {{
        marginTop : 30,
        marginBttom : 30,
      }}>
        {
          CheckInData.map((index,key) => {
            return (
              <View style = {{
                flexDirection : "row",
                marginLeft : 40,
                marginRight : 40,
                marginTop : 10,
                marginBottom : 10,
              }} key = {key}>
                <View style = {{
                  borderRadius : 100,
                  backgroundColor : "orange",
                  height : 60,
                  width : 60,
                  justifyContent : "center",
                }}><Text style={{
                  alignSelf : "center",
                  fontWeight : "bold",
                  fontSize : 25,
                }}>{key+1}</Text></View>
                <Text style = {{  
                  alignSelf : "center",
                  marginLeft : 30,
                  fontWeight : "bold",
                }}>{index.checkInPos}</Text>
              </View>
            )
          })
        }


      </ScrollView>
      <View>
        <TouchableOpacity onPress={getCheckInData} style={styles.roundButton}>
          <Text style={{fontWeight : "bold",}}>Reload</Text>
        </TouchableOpacity>  
      </View> 
    </>
  )
};

const styles = StyleSheet.create({
  roundButton: {
    width: 70,
    height: 70,
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    position : "absolute",
    bottom : 20,
    right : 20,
    //IOS
    shadowColor: "#000000", //그림자색
    shadowOpacity: 0.3,//그림자 투명도
    shadowOffset: { width: 2, height: 2 }, //그림자 위치
    //ANDROID
    elevation: 10,
    justifyContent: "center",
    alignItems : "center",
  },
});

export default CheckIn