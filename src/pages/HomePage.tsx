import { Heading, Text } from "@peerbots/core";
import LatestContentRow from "../components/latestContentRow";
import TrustedContentRow from "../components/trustedContentRow";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Marketplace Hero Banner */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <Heading level={2} className="text-gray-900 font-bold mb-2">
            Discover & Share Robot Interactions
          </Heading>
          <Text size="md" color="muted">
            Explore community-crafted dialogue templates, behaviors, and activities for your social robot. Copy free interactions to your account and load them directly into the Peerbots Controller.
          </Text>
        </div>
      </div>

      <TrustedContentRow />
      <LatestContentRow />
    </div>
  );
}
