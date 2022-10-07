import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Keyboard, Alert, FlatList } from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove } from "firebase/database";
import { Header, Input, Button, ListItem, Icon } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDykIELVq1VtrOaDlisV0whrL5_Ir9Bzm8",
  authDomain: "shopping-list-e3b45.firebaseapp.com",
  databaseURL:
    "https://shopping-list-e3b45-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopping-list-e3b45",
  storageBucket: "shopping-list-e3b45.appspot.com",
  messagingSenderId: "164762227783",
  appId: "1:164762227783:web:5a23310c76c43577ebcd62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState();
  const [list, setList] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, "/listItems");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const products = data
        ? Object.keys(data).map((key) => ({ key, ...data[key] }))
        : [];
      setList(products);
    });
  }, []);

  const addItem = () => {
    if (product !== undefined && amount !== undefined) {
      Keyboard.dismiss();
      push(ref(database, "/listItems"), { product: product, amount: amount });
      setProduct();
      setAmount();
    } else {
      Alert.alert("Product and Amount are required fields!");
    }
  };

  const deleteItem = (id) => {
    remove(ref(database, "listItems/" + id));
  };

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={styles.row}>
          <View>
            <ListItem.Title style={styles.listTitle}>
              {item.product}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.listSubtitle}>
              {item.amount}
            </ListItem.Subtitle>
          </View>
          <View>
            <Button
              icon={{ color: "red", name: "delete", size: 32 }}
              onPress={() => deleteItem(item.key)}
              type="clear"
              containerStyle={{
                margin: 0,
                padding: 0,
              }}
              buttonStyle={{
                margin: 0,
                padding: 0,
              }}
            />
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Header
          centerComponent={{ text: "Shopping List", style: styles.title }}
        />
        <View style={styles.control}>
          <Input
            placeholder="Add product name"
            label="Product"
            labelStyle={{ color: "black" }}
            onChangeText={(product) => setProduct(product)}
            value={product}
          />
          <Input
            placeholder="Add amount"
            label="Amount"
            labelStyle={{ color: "black" }}
            onChangeText={(amount) => setAmount(amount)}
            value={amount}
          />
          <Button
            icon={{ color: "white", name: "save" }}
            iconRight
            iconContainerStyle={{ marginLeft: 10 }}
            onPress={addItem}
            title="Save"
            titleStyle={{ fontWeight: "bold" }}
            buttonStyle={{ padding: 15 }}
            containerStyle={{ width: "95%" }}
          />
        </View>
        <FlatList style={styles.list} data={list} renderItem={renderItem} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  control: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "95%",
    marginTop: 15,
    marginBottom: 5,
  },
  list: {
    width: "95%",
    marginTop: 20,
  },
  row: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  doneButton: {
    marginLeft: 7,
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  listTitle: {
    fontWeight: "bold",
  },
  listSubtitle: {
    color: "grey",
  },
});
