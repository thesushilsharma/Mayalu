"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  HeartIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import { submitOnboarding } from "@/app/actions/onboarding";
import { onboardingFormOpts } from "@/lib/onboarding-form";
import { useToast } from "@/hooks/use-toast";
import { useUserLevel } from "@/contexts/userContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

const steps = ["Basic Info", "About You", "Preferences", "Interests", "Photos"];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addXp } = useUserLevel();
  const [step, setStep] = useState(0);
  const [state, formAction] = useActionState(submitOnboarding, initialFormState);

  const form = useForm({
    ...onboardingFormOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  const interests = [
    "Travel",
    "Reading",
    "Cooking",
    "Fitness",
    "Photography",
    "Movies",
    "Music",
    "Art",
    "Dancing",
    "Hiking",
    "Gaming",
    "Technology",
    "Fashion",
    "Sports",
    "Writing",
    "Yoga",
    "Meditation",
    "Pets",
    "Food",
    "Coffee",
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      const xpRewards = [10, 15, 15, 20, 40];
      addXp(xpRewards[step]);
      toast({
        title: `${steps[step]} saved!`,
        description: `+${xpRewards[step]} XP earned for completing this section`,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <CardContent className="space-y-4">
              <form.Field
                name="birthdate"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Birthdate is required" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Birthdate</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="gender"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Please select a gender" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel>Gender</FieldLabel>
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as "male" | "female" | "non-binary" | "other"
                        )
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non-binary" id="non-binary" />
                        <Label htmlFor="non-binary">Non-binary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="location"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Location is required" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="City, Country"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="button" onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );

      case 1:
        return (
          <>
            <CardContent className="space-y-4">
              <form.Field
                name="bio"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.length < 10) {
                      return "Bio must be at least 10 characters";
                    }
                    if (value.length > 500) {
                      return "Bio cannot exceed 500 characters";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldDescription className="text-right">
                      {field.state.value.length}/500
                    </FieldDescription>
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="height"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Height is required" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Height</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Height in cm"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="education"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Education is required" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Education</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Highest education level"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="occupation"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Occupation is required" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Occupation</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Your profession"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );

      case 2:
        return (
          <>
            <CardContent className="space-y-4">
              <form.Field name="relationshipType">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-base">Relationship Mode</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose your preferred relationship type
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`border rounded-lg p-4 cursor-pointer transition-all w-full text-left ${
                          field.state.value === "dating"
                            ? "border-primary bg-primary/10"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => field.handleChange("dating")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <HeartIcon className="h-5 w-5 mr-2 text-rose-500" />
                            <h3 className="font-medium">Dating</h3>
                          </div>
                          <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                            {field.state.value === "dating" && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Find casual dates and relationships with like-minded people
                        </p>
                      </button>

                      <button
                        type="button"
                        className={`border rounded-lg p-4 cursor-pointer transition-all w-full text-left ${
                          field.state.value === "matrimonial"
                            ? "border-primary bg-primary/10"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => field.handleChange("matrimonial")}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                            <h3 className="font-medium">Matrimonial</h3>
                          </div>
                          <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                            {field.state.value === "matrimonial" && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Find a life partner with compatible values and goals
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field
                name="interestedIn"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Please select who you're interested in" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel>Interested in</FieldLabel>
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as "men" | "women" | "everyone")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="men" id="men" />
                        <Label htmlFor="men">Men</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="women" id="women" />
                        <Label htmlFor="women">Women</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="everyone" id="everyone" />
                        <Label htmlFor="everyone">Everyone</Label>
                      </div>
                    </RadioGroup>
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="ageRangeMin"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Minimum age is required" : undefined,
                  }}
                >
                  {(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                      <FieldLabel htmlFor={field.name}>Minimum Age</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min="18"
                        max="100"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError>
                        {field.state.meta.errors[0]}
                      </FieldError>
                    </Field>
                  )}
                </form.Field>

                <form.Field
                  name="ageRangeMax"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Maximum age is required" : undefined,
                  }}
                >
                  {(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                      <FieldLabel htmlFor={field.name}>Maximum Age</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min="18"
                        max="100"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError>
                        {field.state.meta.errors[0]}
                      </FieldError>
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field
                name="distanceRange"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Distance range is required" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Maximum Distance (km)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="1"
                      max="500"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );

      case 3:
        return (
          <>
            <CardContent className="space-y-4">
              <form.Field
                name="interests"
                validators={{
                  onChange: ({ value }) =>
                    value.length < 3 ? "Please select at least 3 interests" : undefined,
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel className="text-base">
                      Select your interests (at least 3)
                    </FieldLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {interests.map((interest) => (
                        <Button
                          key={interest}
                          type="button"
                          variant={
                            field.state.value.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            const newInterests = field.state.value.includes(interest)
                              ? field.state.value.filter((i) => i !== interest)
                              : [...field.state.value, interest];
                            field.handleChange(newInterests);
                          }}
                          className="justify-start"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                    <FieldDescription>
                      Selected: {field.state.value.length}/3 minimum
                    </FieldDescription>
                    <FieldError>
                      {field.state.meta.errors[0]}
                    </FieldError>
                  </Field>
                )}
              </form.Field>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );

      case 4:
        return (
          <>
            <CardContent className="space-y-6">
              <form.Field name="profilePhoto">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-base">Upload Profile Photo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <div className="mx-auto w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4">
                        <span className="text-4xl text-muted-foreground">+</span>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          // Simulate photo upload
                          field.handleChange("https://source.unsplash.com/random/300x300/?portrait");
                        }}
                      >
                        Select Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field name="additionalPhotos">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-base">
                      Additional Photos (Optional)
                    </Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <button
                          key={i}
                          type="button"
                          className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors"
                          onClick={() => {
                            // Simulate photo upload
                            const newPhotos = [...field.state.value, `https://source.unsplash.com/random/300x300/?portrait&sig=${i}`];
                            field.handleChange(newPhotos);
                          }}
                        >
                          <span className="text-2xl text-muted-foreground">+</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form.Field>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <form.Subscribe
                selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Profile
                      </>
                    ) : (
                      "Complete Profile"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </>
        );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only submit on the last step
    if (step === steps.length - 1) {
      await form.handleSubmit();
      
      // Check if form is valid and submission was successful
      const formState = form.store.state;
      if (!formState.errors.length) {
        addXp(40);
        toast({
          title: "Profile complete!",
          description: "Your profile has been created successfully. +40 XP earned!",
        });
        router.push("/account/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <HeartIcon className="h-8 w-8 text-rose-500" />
            <h1 className="text-3xl font-bold">Mayalu</h1>
          </Link>
        </div>

        <div className="mb-8">
          <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{steps[step]}</span>
          </div>
        </div>

        <form action={formAction as never} onSubmit={handleSubmit}>
          {formErrors.length > 0 && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              {formErrors.map((error) => (
                <p key={String(error)} className="text-sm text-destructive">
                  {String(error)}
                </p>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{steps[step]}</CardTitle>
              <CardDescription>
                {step === 0 && "Let's start with some basic information"}
                {step === 1 && "Tell us more about yourself"}
                {step === 2 && "What are you looking for?"}
                {step === 3 && "Select interests that match your personality"}
                {step === 4 && "Add photos to complete your profile"}
              </CardDescription>
            </CardHeader>

            {renderStep()}
          </Card>
        </form>
      </div>
    </div>
  );
}
