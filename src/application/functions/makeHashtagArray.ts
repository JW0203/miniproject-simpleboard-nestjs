import { HashtagService } from '../services/hashtag.service';
import { Hashtag } from '../../domain/entities/Hashtag.entity';

export async function makeHashtagArrayByName(hashtags: string[], hashtagService: HashtagService) {
  const hashtagArray: (Hashtag | null)[] = await hashtagService.findHashtags(hashtags);
  // const notCreatedHashtagArray: { name: string; error: string }[] = [];
  const newHashtags: Hashtag[] = [];
  const createHashtagNameList = [];
  for (const index in hashtagArray) {
    if (hashtagArray[index] === null) {
      createHashtagNameList.push({ name: hashtagArray[index], index });
      // try {
      //   const newHashtag: Hashtag = await hashtagService.create({ name: hashtags[i] });
      //   hashtagArray[i] = newHashtag;
      //   newHashtags.push(newHashtag);
      // } catch (error: any) {
      //   notCreatedHashtagArray.push({ name: hashtags[i], error: error.message });
      // }
    }
  }
  await Promise.all(
    createHashtagNameList.map(async (element) => {
      const { name, index } = element;
      const newHashtag = await hashtagService.create({ name });
      newHashtags.push(newHashtag);
      hashtagArray[index] = newHashtag;
    }),
  );
  return {
    Hashtags: hashtagArray.filter((hashtag) => hashtag !== null),
    newHashtags: newHashtags,
    // notCreatedHashtags: notCreatedHashtagArray,
  };
}
