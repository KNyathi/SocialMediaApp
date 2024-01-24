import { StyleSheet, View, FlatList, Pressable} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tweets from '@/assets/data/tweets';
import Tweet from '@/components/Tweet';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  return (
  <View style= { styles.page}>
  
    <FlatList data={tweets} renderItem= {({item}) => <Tweet tweet={item} />}/>
    
    <Pressable style={styles.floatingButton}>
      <Link href='/new-tweet/' asChild >
        <FontAwesome name="plus-square" size={24} color="white" style={styles.floatingButton} />     
      </Link>
    </Pressable>
  </View>  
    
  );
}


const styles = StyleSheet.create({
  page : {
    flex: 1,
    backgroundColor: 'white',
  },
  
  floatingButton: {
    backgroundColor: 'indigo',
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: 'right',
    lineHeight: 80,
    position: 'absolute',
    right: 15,
    bottom: 15,
    
    shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 3,
	},
	shadowOpacity: 0.27,
	shadowRadius: 4.65,

	elevation: 6,
	overflow: 'hidden',
  },
  
});
