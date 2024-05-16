import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import api from './src/service/api';

export default function App() {

  const [dados, setDados] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);


  const selecionarArquivo = async () => {
    try {
      // Fornece acesso à UI do sistema para selecionar documentos disponíveis no dispositivo do usuário.
      const resultado = await DocumentPicker.getDocumentAsync();
      console.log(resultado);

      // Verificar se o usuário cancelou a seleção do arquivo
      if (resultado.canceled == true) {
        console.log('Busca de arquivo cancelada!');
        setDados(null);
        return;
      }

      // Desestruturar o objeto para obter as propriedades desejadas
      const { assets: [{ mimeType, uri }], canceled } = resultado;
      console.log(mimeType);


      // Verificar se o arquivo é do tipo JSON
      if (mimeType !== 'application/json') {
        Alert.alert('O arquivo selecionado não é do tipo JSON')
        setDados(null);
        // console.warn('O arquivo selecionado não é do tipo JSON');
        return;
      }

      // Ler o conteúdo do arquivo
      const conteudo = await FileSystem.readAsStringAsync(uri);
      const dadosJSON = JSON.parse(conteudo);
      // Atualizar o estado com os dados do arquivo JSON
      setDados(dadosJSON);

    } catch (error) {
      console.error('Erro ao selecionar o arquivo:');
    }
  };


  const enviarDados = async () => {
    try {
      await api.post('/cadastro/novo', dados)
        .then(response => {
          console.log(response.data);
        }).catch(error => {
          console.log(error);
        })


    } catch {
      console.log('Erro ao inserir dados:');
      Alert.alert('Erro ao inserir dados no banco de dados')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerLargura}>
        <View style={styles.topo}>
          <Text style={styles.titleConteudo}>Leitura de arquivo JSON com React Native</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={selecionarArquivo}>
          <Text style={styles.buttonText}>Selecionar Arquivo</Text>
        </TouchableOpacity>
        {/* Operador ternário, verifica se o 'useState' dados está definido diferende de null, false ou undefined */}
        {dados ? (
          <View>

            <Text>Dados do arquivo JSON:</Text>
            <Text>{JSON.stringify(dados)}</Text>

            <Text style={styles.titleInfo}>Nome:</Text>
            <TextInput style={styles.textInput} value={dados.nome} placeholder='nome' />

            <Text style={styles.titleInfo}>Data de Nasc.:</Text>
            <TextInput style={styles.textInput} value={dados.data_nasc} placeholder='data_nasc' />

            <Text style={styles.titleInfo}>E-mail:</Text>
            <TextInput style={styles.textInput} value={dados.email} placeholder='email' />

            <Text style={styles.titleInfo}>Telefone:</Text>
            <TextInput style={styles.textInput} value={dados.telefone} placeholder='telefone' />

          </View>
        ) : (
          <Text>Nenhum arquivo selecionado</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={enviarDados}>
          <Text style={styles.buttonText}>Inserir no banco de dados</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLargura: {
    width: '95%',
    justifyContent: 'center',
  },
  titleConteudo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    height: 45,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#4054F7',
    borderWidth: 1,
    borderColor: '#4D95F7',
    borderRadius: 8,
  },
  titleInfo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#4096F7',
    marginBottom: 1
  },
  button: {
    // alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
    // width: "100%",
    height: 45,
    backgroundColor: "#4096F7",
    borderRadius: 8,
    elevation: 5,
    // shadowOpacity: 1,
    // shadowColor: 'black',
    // shadowRadius: 5,
    // gap: 10,
    padding: 10,
    marginTop: 25,
    marginBottom: 25
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  topo: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});