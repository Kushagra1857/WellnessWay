from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, BatchNormalization, Conv2D, MaxPooling2D, Input
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import matplotlib.pyplot as plt
import numpy as np
import os

# Directories
train_data_dir = r"train-data-path"
validation_data_dir = r"validation-data-path"

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    shear_range=0.3,
    zoom_range=0.3,
    brightness_range=[0.8, 1.2],
    horizontal_flip=True,
    fill_mode='nearest'
)
validation_datagen = ImageDataGenerator(rescale=1./255)

batch_size = 64
img_size = (48, 48)

# Generators
train_generator = train_datagen.flow_from_directory(
    train_data_dir,
    color_mode='grayscale',
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical',
    shuffle=True
)
validation_generator = validation_datagen.flow_from_directory(
    validation_data_dir,
    color_mode='grayscale',
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical',
    shuffle=True
)

# Helper: Convert grayscale to RGB
def wrap_generator(generator):
    while True:
        x, y = next(generator)
        x_rgb = np.concatenate([x]*3, axis=-1)
        yield x_rgb, y

train_gen_rgb = wrap_generator(train_generator)
val_gen_rgb = wrap_generator(validation_generator)

# Steps
num_train_imgs = sum(len(files) for _, _, files in os.walk(train_data_dir))
num_test_imgs = sum(len(files) for _, _, files in os.walk(validation_data_dir))
steps_per_epoch = num_train_imgs // batch_size
validation_steps = num_test_imgs // batch_size

# VGG16 base model
vgg_base = VGG16(weights='imagenet', include_top=False, input_shape=(48, 48, 3))

# Freeze all layers except last 2
for layer in vgg_base.layers[:-2]:
    layer.trainable = False
for layer in vgg_base.layers[-2:]:
    layer.trainable = True

# Build model
model = Sequential()
model.add(Input(shape=(48, 48, 3)))
model.add(vgg_base)

# Extra Conv Block 1
model.add(Conv2D(64, (3, 3), activation='relu', padding='same'))
model.add(BatchNormalization())

# Extra Conv Block 2
model.add(Conv2D(128, (3, 3), activation='relu', padding='same'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.1))

# Final dense layers
model.add(Flatten())
model.add(Dense(512, activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(7, activation='softmax'))

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
print(model.summary())

# Callbacks
checkpoint = ModelCheckpoint(
    'best_model_vgg16_2blocks.h5',
    monitor='val_accuracy',
    save_best_only=True,
    mode='max',
    verbose=1
)

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True,
    verbose=1
)

# Train
epochs = 100
history = model.fit(
    train_gen_rgb,
    steps_per_epoch=steps_per_epoch,
    epochs=epochs,
    validation_data=val_gen_rgb,
    validation_steps=validation_steps,
    callbacks=[checkpoint, early_stop]
)

# Plot
plt.figure(figsize=(14, 5))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train Accuracy', marker='o')
plt.plot(history.history['val_accuracy'], label='Val Accuracy', marker='o')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train Loss', marker='o')
plt.plot(history.history['val_loss'], label='Val Loss', marker='o')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
