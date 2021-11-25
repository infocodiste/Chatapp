import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";

// Loading indicater view
export default class LoadingView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(110,110,110,0.5)"
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: "transparent", //"rgba(255,255,255,1)",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            overflow: "hidden"
          }}
        >
          <ActivityIndicator size="large" color="white"/>
        </View>
      </View>
    );
  }
}