import React, { Component } from 'react'
import { View, FlatList, Dimensions, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            calculatorNumbers: [{
                id: 0,
                num: 1,
            }, {
                id: 1,
                num: 2,
            }, {
                id: 2,
                num: 3,
            }, {
                id: 3,
                num: 4,
            }, {
                id: 4,
                num: 5,
            }, {
                id: 5,
                num: 6,
            }, {
                id: 6,
                num: 7,
            }, {
                id: 7,
                num: 8,
            }, {
                id: 8,
                num: 9,
            }, {
                id: 9,
                num: 0,
            }],
            operatorsSymb: [{
                id: 0,
                operator: "+"
            }, {
                id: 1,
                operator: "-"
            }, {
                id: 2,
                operator: "*"
            }, {
                id: 3,
                operator: "%"
            },],
            inputNumber: '',
            HasEnteredOperator: false,
        };
    }

    onInputNumberChange = val => this.setState({ inputNumber: val });

    onHandlePress = (id) => {
        const selectedNum = this.returnNumber(id);
        this.setState({ inputNumber: this.state.inputNumber + selectedNum });
        this.setState({ hasEnteredOperator: false });
    }

    returnNumber = (id) => {
        let temp = [...this.state.calculatorNumbers];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === id) {
                return temp[i].num;
            }
        }
    }

    onDeleteNum = () => {
        this.setState({ inputNumber: this.state.inputNumber.toString().slice(0, -1) });
    }

    onDeleteAllNum = () => {
        this.setState({ inputNumber: this.state.inputNumber = '' })
    }

    onHandleOperate = (id) => {
        const { operatorsSymb, hasEnteredOperator, inputNumber } = this.state;
        console.log(operatorsSymb);
        const selectedOperator = operatorsSymb.find(b => b.id === id);
        let formatInput = inputNumber;
        console.log(inputNumber);
        if (hasEnteredOperator) {
            formatInput = inputNumber.split('').slice(0, -1).join('');
            console.log(inputNumber)
        }
        let inputdata = '';
        if (this.state.inputNumber === '') {
            inputdata = "0" + selectedOperator.operator;
        }
        else {
            inputdata = formatInput + selectedOperator.operator;
        }
        this.setState({ inputNumber: inputdata });
        this.setState({ hasEnteredOperator: true });
    }

    onGetResult = async () => {
        try {
            this.setState({ inputNumber: eval(this.state.inputNumber).toString() });
            await AsyncStorage.setItem("inputNumberKey", this.state.inputNumber);
            console.log("data saved");
        }
        catch (error) {
            console.error(error);
            console.log("data not saved");
        }
    }

    async componentDidMount() {
        try {
            let newInputNumber = await AsyncStorage.getItem("inputNumberKey");
            this.setState({ inputNumber: newInputNumber });
            console.log("data retreived");
        } catch (error) {
            console.log(error);
        };
    }

    /* allow phone call permission for Android */
    onAllowPermission = () => {
        request(PERMISSIONS.ANDROID.CALL_PHONE).then(response =>
            console.log(response, "permission granted!"));
    }

    render() {
        const { calculatorNumbers, inputNumber, operatorsSymb } = this.state;
        return (
            <View style={{
                width: Dimensions.get('screen').width,
                height: Dimensions.get('screen').height,
                backgroundColor: "#243441",
            }}>
                <View style={{ position: "relative", marginHorizontal: 10, flexDirection: "column", marginTop: 120 }}>

                    <View style={{ width: "100%", flexDirection: "column", justifyContent: "flex-end" }}>
                        <View>
                            <TouchableOpacity>
                                <Text style={{ marginTop: 20, fontSize: 80, color: "#fff" }}>{inputNumber}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TextInput
                                style={{ width: 200, height: 60, color: "#fff", fontSize: 30 }}
                                value={inputNumber}
                                onChangeText={(val) => this.onInputNumberChange(val)}
                            />
                            <Text>{this.newInputNumber}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: 'flex-end', marginHorizontal: 4, marginRight: 10 }}>
                        <TouchableOpacity
                            style={{ width: 85, height: 85, borderRadius: 50, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginHorizontal: 5, marginVertical: 3 }}
                            onPress={this.onGetResult}>
                            <Text style={{ fontSize: 30, color: "#000", fontWeight: 'bold' }}>=</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: 85, height: 85, borderRadius: 50, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginHorizontal: 5, marginVertical: 3 }}
                            onPress={this.onDeleteAllNum}>
                            <Text style={{ fontSize: 24, color: "#000", fontWeight: 'bold' }}>DEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: 85, height: 85, borderRadius: 50, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginHorizontal: 5, marginVertical: 3 }}
                            onPress={this.onDeleteNum}>
                            <Image source={require("../assets/7691897.png")} style={{ width: 60, height: 60 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', display: "flex", flexDirection: "row" }}>
                        <FlatList
                            data={calculatorNumbers}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => this.onHandlePress(item.id)}
                                    style={{ width: 85, height: 85, borderRadius: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginHorizontal: 5, marginVertical: 3 }}>
                                    <Text style={{ color: "#000", textAlign: "center", fontSize: 26, fontWeight: 'bold' }}>{item.num}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <FlatList
                            data={operatorsSymb}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ width: 85, height: 85, borderRadius: 50, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 3 }}
                                    onPress={() => this.onHandleOperate(item.id)}>
                                    <Text style={{ fontSize: 45, color: "#ED802E" }}>{item.operator}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>


            </View>
        );
    };
}

export default HomeScreen;