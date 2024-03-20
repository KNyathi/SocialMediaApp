import { Text, ActivityIndicator } from 'react-native';
import Tweet from '@/components/Tweet';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTweetsApi } from '../../../../../lib/api/tweets';

export default function TweetScreen() {
  const { getTweet } = useTweetsApi();
  const {id} = useLocalSearchParams();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['tweet', id],
    queryFn: () => getTweet(id as string),
  });

  
  if (isLoading) {
    return <ActivityIndicator />;
  }
  
  if (error) {
   return <Text>Tweet {id} not found!</Text>;
  }
  
  return <Tweet tweet={data} />;
  
}
