import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from './Header'; // Assumons que vous avez un composant 'Header' à importer

const FAQsScreen = () => {
  const faqs = [
    {
      question: 'Comment puis-je réinitialiser mon mot de passe ?',
      answer: 'Pour réinitialiser votre mot de passe, rendez-vous sur la page "Mon compte", puis sélectionnez "Gérer mon profil". Ensuite vers la fin, vous pourriez suivre les indications pour modifier votre mot de passe.'
    },
    {
      question: 'Où puis-je consulter mon historique de transactions ?',
      answer: 'Vous pouvez consulter votre historique de transactions dans la section "Mon Compte" puis "Mes Factures".'
    },
    {
      question: 'Comment puis-je mettre à jour mes informations de profil ?',
      answer: 'Vous pouvez mettre à jour vos informations de profil en naviguant vers la section "Mon Compte" et en sélectionnant "Gérer mon profil".'
    },
    {
      question: 'Quels modes de paiement sont acceptés ?',
      answer: 'Nous acceptons divers modes de paiement incluant les cartes de crédit, les cartes de débit et les paiements mobiles.'
    },
    {
      question: 'Comment signaler un problème avec ma commande ?',
      answer: 'S’il y a un problème avec votre commande, veuillez utiliser le bouton "Signaler un problème" dans votre historique de commandes ou contacter directement notre équipe de support.'
    },
    {
      question: 'Puis-je changer mon adresse de livraison après avoir passé une commande ?',
      answer: 'Oui, vous pouvez changer votre adresse de livraison après avoir passé une commande tant que la commande n’a pas encore été expédiée.'
    },
    {
      question: 'Existe-t-il un programme de fidélité ?',
      answer: 'Oui, nous offrons un programme de fidélité. Vous pouvez vous inscrire via notre site web ou application mobile pour commencer à accumuler des récompenses.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.title}>FAQs (Questions et Réponses)</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqContainer}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 22,
    fontFamily: 'Ebrimabd',
    color: '#333',
    padding: 20,
    textAlign: 'center'
  },
  faqContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  question: {
    fontSize: 18,
    fontFamily: 'Ebrimabd',
    color: '#444'
  },
  answer: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontFamily: 'Ebrima',
  }
});

export default FAQsScreen;
