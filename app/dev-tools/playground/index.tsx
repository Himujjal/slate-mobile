import { Redirect } from 'expo-router';

export default function PlaygroundIndex() {
  return <Redirect href="/dev-tools/playground?component=button" />;
}
