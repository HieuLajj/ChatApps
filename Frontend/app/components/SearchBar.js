import {View,TextInput,Text,StyleSheet} from "react-native";
import React from "react";

const SearchBar = (props)=>{
    return(
        <View style={styles.container}>
            <TextInput
                placeholder="Search"
                style={styles.input}
                value={props.searchText}
                onChangeText={(text)=>props.setSearchText(text)}
                onSubmitEditing={props.onSubmit}
            />
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container:{
        paddingTop: 30, 
        paddingHorizontal: 10,
        backgroundColor: "#ffffff",
        margin: 10
    },
    input:{
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1
    }
});