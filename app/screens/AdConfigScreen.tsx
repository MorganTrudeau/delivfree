import React, { useEffect, useMemo, useState } from "react";
import { Screen, Text, TextField } from "app/components";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAlert, useToast, useUploadImage } from "app/hooks";
import { Cuisine, Cuisines } from "delivfree";
import { getCuisineTitle } from "app/utils/cuisines";
import { DropDownPicker } from "app/components/DropDownPicker";
import {
  ActivityIndicator,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors, spacing } from "app/theme";
import { ImageStyle } from "react-native-fast-image";
import { AdCache, AdConfig, AdType, useAdBanner } from "app/hooks/useAdBanner";
import { ImageUpload } from "app/components/ImageUpload";
import { ScreenHeader } from "app/components/ScreenHeader";
import firestore from "@react-native-firebase/firestore";

interface AdConfigScreenProps extends AppStackScreenProps<"AdConfig"> {}

export const AdConfigScreen = ({ navigation }: AdConfigScreenProps) => {
  const Alert = useAlert();
  const Toast = useToast();

  const { uploadImage } = useUploadImage();

  const ads = useAdBanner();

  const [adUploads, setAdUploads] = useState<AdCache>({});
  const [loading, setLoading] = useState(false);

  const hasUnsavedChanges = useMemo(
    () => !!Object.values(adUploads).length,
    [adUploads]
  );

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          "Discard ad config changes?",
          "You have unsaved changes. Are you sure to discard them and leave the screen?",
          [
            { text: "Don't leave", style: "cancel", onPress: () => {} },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );

  const handleImagePicked = (key: AdType) => (image: string) =>
    setAdUploads((s) => ({ ...s, [key]: { ...s[key], image } }));
  const handleTitleChange = (key: AdType) => (title: string) =>
    setAdUploads((s) => ({ ...s, [key]: { ...s[key], title } }));
  const handleTextChange = (key: AdType) => (text: string) =>
    setAdUploads((s) => ({ ...s, [key]: { ...s[key], text } }));

  const handleSaveAds = async () => {
    try {
      setLoading(true);
      const adsCollection = firestore().collection("AdBanners");
      const batch = firestore().batch();

      const uploadedAds = await Promise.all(
        Object.entries(adUploads).map(async ([adType, adConfig]) => {
          const uploadedImage = await uploadImage(
            adConfig.image,
            `AdBanners/${adType}`
          );
          return [
            adType,
            { ...adConfig, image: uploadedImage } as AdConfig,
          ] as [AdType, AdConfig];
        })
      );

      uploadedAds.forEach(([adType, adConfig]) => {
        batch.set(adsCollection.doc(adType), adConfig);
      });

      await batch.commit();
      setLoading(false);
      setAdUploads({});
      Toast.show("Ads updated!");
    } catch (error) {
      console.log("Save ads error", error);
      Toast.show("Ads failed to update. Please try again.");
      setLoading(false);
    }
  };

  const pickerItems = useMemo(
    () =>
      Object.values(Cuisines).map((c) => ({
        label: getCuisineTitle(c),
        value: c,
      })),
    []
  );

  const onCuisineSelect = (cuisines: Cuisine[]) => {
    const cuisine = cuisines[0];
    if (!cuisine) {
      return;
    }
    setAdUploads((s) => ({
      ...s,
      [cuisine]: { text: "", title: "", image: "", ...s[cuisine] },
    }));
  };

  const confirmDelete = (adType: AdType) => async () => {
    const shouldContinue = await new Promise((resolve) => {
      Alert.alert("Delete Ad", "Are you sure you want to delete this ad?", [
        { text: "Cancel", onPress: () => resolve(false) },
        { text: "Delete", onPress: () => resolve(true), style: "destructive" },
      ]);
    });
    if (!shouldContinue) {
      return;
    }
    try {
      await firestore().collection("AdBanners").doc(adType).delete();
      setAdUploads((state) => {
        const { [adType]: _, ...newState } = state;
        return newState;
      });
      Toast.show("Ad deleted");
    } catch (error) {
      Toast.show("Ad failed to delete. Please try again.");
    }
  };

  const { general, checkout, ...cuisineAds } = { ...ads, ...adUploads };

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  return (
    <Screen
      style={$screen}
      contentContainerStyle={$containerPadding}
      preset="scroll"
    >
      <ScreenHeader
        title="Ad Config"
        buttonTitle="Save changes"
        onButtonPress={hasUnsavedChanges ? handleSaveAds : undefined}
        RightAccessory={Loading}
        hideIcon
      />
      <View style={$uploadSection}>
        <Text preset="subheading" style={$heading}>
          General Ad
        </Text>
        <ImageUpload
          localImage={adUploads.general?.image}
          uploadedImage={general?.image}
          onLocalImagePicked={handleImagePicked("general")}
          style={$uploadImage}
          imageContainerStyle={$imageContainerStyle}
          buttonHelpText={recommendedSizeHelpText}
        />
        <TextField
          placeholder="Ad title"
          onChangeText={handleTitleChange("general")}
          containerStyle={$input}
          value={adUploads.general?.title || ads.general?.title}
        />
        <TextField
          placeholder="Ad text"
          onChangeText={handleTextChange("general")}
          containerStyle={$input}
          value={adUploads.general?.text || ads.general?.text}
        />
        {ads.general && (
          <Pressable onPress={confirmDelete("general")}>
            <Text style={{ color: colors.textDim }}>Delete ad</Text>
          </Pressable>
        )}
      </View>

      <View style={$uploadSection}>
        <Text preset="subheading" style={$heading}>
          Checkout Ad
        </Text>
        <ImageUpload
          localImage={adUploads.checkout?.image}
          uploadedImage={checkout?.image}
          onLocalImagePicked={handleImagePicked("checkout")}
          style={$uploadImage}
          imageContainerStyle={$imageContainerStyle}
          buttonHelpText={recommendedSizeHelpText}
        />
        <TextField
          placeholder="Ad title"
          onChangeText={handleTitleChange("checkout")}
          containerStyle={$input}
          value={adUploads.checkout?.title || ads.checkout?.title}
        />
        <TextField
          placeholder="Ad text"
          onChangeText={handleTextChange("checkout")}
          containerStyle={$input}
          value={adUploads.checkout?.text || ads.checkout?.text}
        />
        {ads.checkout && (
          <Pressable onPress={confirmDelete("checkout")}>
            <Text style={{ color: colors.textDim }}>Delete ad</Text>
          </Pressable>
        )}
      </View>

      <View style={$uploadSection}>
        <Text preset="subheading" style={$heading}>
          Create cuisine Ad
        </Text>
        <DropDownPicker
          items={pickerItems}
          onSelect={onCuisineSelect}
          placeholder="Choose cuisine"
          singleSelect
        />
      </View>

      {typeof cuisineAds === "object" &&
        Object.entries(cuisineAds).map(([cuisine, cuisineAd]) => {
          const cuisineAdType = cuisine as AdType;
          const title = getCuisineTitle(cuisine as Cuisine);
          return (
            <View style={$uploadSection}>
              <Text preset="subheading" style={$heading}>
                {title} Ad
              </Text>
              <ImageUpload
                localImage={adUploads[cuisineAdType]?.image}
                uploadedImage={cuisineAd?.image}
                onLocalImagePicked={handleImagePicked(cuisineAdType)}
                style={$uploadImage}
                imageContainerStyle={$imageContainerStyle}
                buttonHelpText={recommendedSizeHelpText}
              />
              <TextField
                placeholder="Ad title"
                onChangeText={handleTitleChange(cuisineAdType)}
                containerStyle={$input}
                value={
                  adUploads[cuisineAdType]?.title || ads[cuisineAdType]?.title
                }
              />
              <TextField
                placeholder="Ad text"
                onChangeText={handleTextChange(cuisineAdType)}
                containerStyle={$input}
                value={
                  adUploads[cuisineAdType]?.text || ads[cuisineAdType]?.text
                }
              />
              {ads[cuisineAdType] && (
                <Pressable onPress={confirmDelete(cuisineAdType)}>
                  <Text style={{ color: colors.textDim }}>Delete ad</Text>
                </Pressable>
              )}
            </View>
          );
        })}
    </Screen>
  );
};

const recommendedSizeHelpText = "Recommended image size 1500px by 375px";

const $uploadSection: ViewStyle = { marginBottom: spacing.lg };
const $uploadImage: ViewStyle = { marginBottom: spacing.sm };
const $imageContainerStyle: ImageStyle = { aspectRatio: 4, maxWidth: 500 };
const $heading: TextStyle = { marginBottom: spacing.xs };
const $input: ViewStyle = { marginBottom: spacing.sm };
