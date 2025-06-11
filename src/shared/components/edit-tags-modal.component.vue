<script>
export default {
  name: 'EditTagsModal',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tags: [...this.modelValue],
      newTag: ''
    };
  },
  methods: {
    addTag() {
      const tag = this.newTag.trim();
      if (tag && !this.tags.includes(tag)) {
        this.tags.push(tag);
        this.newTag = '';
      }
    },
    removeTag(tag) {
      this.tags = this.tags.filter(t => t !== tag);
    },
    saveTags() {
      this.$emit('update:modelValue', this.tags);
      this.$emit('close');
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Editar Tecnologías / Especializaciones</h3>

      <div class="tag-list">
        <span v-for="tag in tags" :key="tag" class="tag">
          {{ tag }}
          <button class="remove" @click="removeTag(tag)">x</button>
        </span>
      </div>

      <div class="add-tag">
        <input v-model="newTag" placeholder="Nueva tecnología" @keyup.enter="addTag" />
        <button @click="addTag">Agregar</button>
      </div>

      <div class="actions">
        <button class="cancel" @click="closeModal">Cancelar</button>
        <button class="save" @click="saveTags">Guardar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #c9d8f0;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
}

.remove {
  background: none;
  border: none;
  color: red;
  margin-left: 0.4rem;
  cursor: pointer;
}

.add-tag {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.cancel {
  background: #1c1f2b;
  color: white;
}

.save {
  background: #FFD479;
  color: #1c1f2b;
}
</style>
