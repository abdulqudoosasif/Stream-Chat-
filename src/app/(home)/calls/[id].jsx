import {
  StreamCall,
  RingingCallContent,
  useCalls,
} from '@stream-io/video-react-native-sdk';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function CallScreen() {
  const calls = useCalls();
  const call = calls[0];

  // const [call, setCall] = useState<Call>();

  // const client = useStreamVideoClient();

  // useEffect(() => {
  //   const fetchCall = async () => {
  //     const call = client.call('default', id);
  //     await call.get();
  //     setCall(call);
  //   };
  //   fetchCall();
  //   return () => {
  //     if (call) {
  //       call.leave();
  //     }
  //   };
  // }, [id]);

  if (!call) {
    if (router.canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
    return null;
  }

  return (

    <StreamCall call={call}>
      <RingingCallContent />
    </StreamCall>

  );
}