import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';

import { ProfileCover } from './profile-cover';
import { ProfileInfo } from './profile-info';

export const ProfileHeader = () => {
  return (
    <>
      <ProfileCover />
      <FullWidthDivider />
      <ProfileInfo />
    </>
  );
};
